# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Python / Flask 1.1.1** + **SQLAlchemy** (SQLite or PostgreSQL via `DATABASE_URL`)
- **Flask-Migrate** (Alembic) for database migrations
- **Redis** for music playback state and process tracking
- **React 16** + **Redux** + **Webpack 4** (Node 12.17.0)
- **handy-components** library for admin CRUD UI
- **OMXPlayer** (Raspberry Pi) for audio playback

## Commands

```bash
# Start Flask server
python3 -m flask run --host 0.0.0.0
# Or via script
bin/hub/server

# Start full system (server + Chromium kiosk display)
bin/hub/start
bin/hub/stop

# Frontend — watch mode for development
npm start

# Frontend — build
npm run build:dev
npm run build:prod

# Database migrations
flask db migrate
flask db upgrade
```

## Architecture Overview

This is a **touchscreen jukebox + transit app** built for a Raspberry Pi. Flask serves both the public UI and an admin panel. React mounts into Jinja2-rendered pages.

### Request Flow

1. Flask renders a Jinja2 template with a `<div id="...">` mount point
2. Webpack bundle (`app/static/javascript/bundle.js`) loads
3. `frontend/entry.jsx` scans `DOMContentLoaded` for known element IDs and mounts components
4. Components use Redux + thunk to call Flask API endpoints via AJAX
5. API responses update the Redux store → React re-renders

### Route Structure

All routes are defined in `app/routes.py`. There are two tiers:
- **Public UI routes** (e.g., `/`, `/albums/*`, `/subway`) — render Jinja2 templates
- **API routes** (`/api/*`) — return JSON, consumed by React components

Admin routes (`/admin/albums`, `/admin/albums/<id>`) render templates that mount the `handy-components` `StandardIndex` / `SimpleDetails` CRUD components. The admin backend receives form data as `album[property_name]` and returns camelCase JSON.

### Music Playback

1. `POST /api/music/start` stops any running OMXPlayer, launches a new subprocess, stores the PID in Redis
2. A background thread (`check_music_status()` in `app/__init__.py`) polls for process completion and auto-advances tracks
3. Frontend polls `GET /api/music/now_playing` every second to sync UI state
4. Redis keys track `album_id` and `track` (current position); PIDs stored in a Redis set

### Data Model

Single `Album` model (`app/models.py`): `id`, `name`, `artist_name`, `order`, `category` (1=Modern, 2=Classical, 3=Christmas).

### Key Integrations

- **MTA GTFS Realtime API** — `GET /api/subway` fetches protobuf train data, parses F/G/B/Q arrivals at a fixed station, calculates ETAs using walk-time env vars. Frontend refreshes every 15 seconds.
- **DS18B20 Temperature Sensor** (Raspberry Pi only) — reads from `/sys/bus/w1/devices/28*/w1_slave`. Returns `null` outside production.
- **Redis** — required for music state; start Redis before the Flask server.

### Environment Variables (`.env`)

`FLASK_APP`, `FLASK_DEBUG`, `MTA_API_KEY`, `MUSIC_DIRECTORY`, walk-time vars for subway ETA calculation.

### Frontend State

Redux store uses a single `standardReducer` that handles `FETCH_ENTITIES`, `CREATE_ENTITY`, `FETCH_ENTITY`, `UPDATE_ENTITY`, `SEND_REQUEST`, and `ERRORS` actions. All action properties are spread directly into state (no normalized structure). Actions live in `frontend/actions/index.js`.
