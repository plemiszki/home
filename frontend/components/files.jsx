import React, { useEffect, useState } from "react";
import { Spinner } from "handy-components";

function Album({ album }) {
  return (
    <div className="album">
      <p
        className="album-name"
        onClick={() => album.recordExists && window.open(`/admin/albums/${album.albumId}`, '_blank')}
        style={{ cursor: album.recordExists ? 'pointer' : 'default', userSelect: 'none' }}
      >
        {album.name}
        {album.recordExists ? <span className="checkmark">✓</span> : <span className="x">✗</span>}
      </p>
      <ul>
        {album.files.map((file) => (
          <li key={file}>{file}</li>
        ))}
      </ul>
      <style jsx>{`
        .album {
          margin-bottom: 20px;
        }
        .album-name {
          font-family: "TeachableSans-SemiBold";
          font-size: 14px;
          color: #2c2f33;
          margin-bottom: 5px;
          display: inline-block;
        }
        .checkmark {
          color: green;
          margin-left: 4px;
        }
        .x {
          color: red;
          margin-left: 4px;
        }
        li {
          font-size: 12px;
          color: #6c757d;
          margin-left: 20px;
          list-style: disc;
        }
      `}</style>
    </div>
  );
}

function Artist({ artist }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="artist">
      <p className="artist-name" onClick={() => setExpanded(!expanded)}>
        <span className="arrow">{expanded ? "▼" : "▶"}</span>
        {artist.name}
        {artist.albums.every((a) => a.recordExists) ? <span className="checkmark">✓</span> : <span className="x">✗</span>}
      </p>
      {expanded &&
        artist.albums.map((album) => <Album key={album.name} album={album} />)}
      <style jsx>{`
        .artist {
          margin-bottom: 30px;
        }
        .artist-name {
          font-family: "TeachableSans-Bold";
          font-size: 16px;
          color: #2c2f33;
          margin-bottom: 10px;
          border-bottom: solid 1px #e0e0e0;
          padding-bottom: 5px;
          cursor: pointer;
          user-select: none;
        }
        .arrow {
          margin-right: 8px;
          font-size: 12px;
        }
        .checkmark {
          color: green;
          margin-left: 8px;
        }
        .x {
          color: red;
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
}

function Files() {
  const [artists, setArtists] = useState([]);
  const [spinner, setSpinner] = useState(true);

  useEffect(() => {
    fetch("/api/files")
      .then((res) => res.json())
      .then((body) => { setArtists(body.artists); setSpinner(false); });
  }, []);

  return (
    <div className="handy-component">
      <h1>Files</h1>
      <div className="white-box">
        <Spinner visible={spinner} />
        {!spinner && artists.map((artist) => (
          <Artist key={artist.name} artist={artist} />
        ))}
      </div>
    </div>
  );
}

export default Files;
