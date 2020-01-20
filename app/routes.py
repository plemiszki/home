# /etc/lightdm/lightdm.conf
import os
import json
import random
from app import app, db
from flask import render_template, jsonify, request
from app.utils import stop_everything
from app.models import Album
from to_camel_case import to_camel_case
from subprocess import Popen
from flask_redis import FlaskRedis
redis_client = FlaskRedis(app)

@app.route('/')
def home():
    return render_template('public/home.html')

@app.route('/music/modern')
def music_modern():
    stop_everything()
    albums = Album.query.order_by('artist_name', 'name').all()
    return render_template('public/music/modern.html', albums=albums)

@app.route('/music/classical')
def music_classical():
    stop_everything()
    albums = Album.query.order_by('artist_name', 'name').all()
    return render_template('public/music/classical.html', albums=albums)

@app.route('/music/play/<album_id>')
def play(album_id):
    stop_everything()
    album = Album.query.get(album_id)
    music_directory = os.getenv('MUSIC_DIRECTORY')
    filenames = os.listdir(f"{music_directory}/{album.artist_name}/{album.name}")
    filenames.sort()
    song_titles = map(lambda song_title: ' '.join('.'.join(song_title.split('.')[:-1]).split(' ')[1:]), filenames)
    process_id = Popen(['omxplayer', '-o', 'local', f"{music_directory}/{album.artist_name}/{album.name}/{filenames[0]}"]).pid
    redis_client.sadd('processes', process_id)
    redis_client.set('album_id', album.id)
    redis_client.set('track', 1)
    return render_template('/public/music/play.html', album=album, song_titles=song_titles)

# public apis:

@app.route('/api/play_song', methods=['POST'])
def api_play_song():
    request_body = json.loads(request.get_data().decode("utf-8"))
    track = int(request_body['track'])
    process_ids = list(redis_client.smembers('processes'))
    for process_id in process_ids:
        process_id = process_id.decode("utf-8")
        child_process_id = os.popen(f"ps --ppid {process_id} -o pid=").read().split("\n")[0].strip()
        os.system(f"kill -9 {child_process_id}")
    redis_client.delete('processes')
    album_id = redis_client.get('album_id').decode('utf-8')
    album = Album.query.get(album_id)
    music_directory = os.getenv('MUSIC_DIRECTORY')
    filenames = os.listdir(f"{music_directory}/{album.artist_name}/{album.name}")
    filenames.sort()
    song_titles = map(lambda song_title: song_title.split('.')[0][2:], filenames)
    process_id = Popen(['omxplayer', '-o', 'local', f"{music_directory}/{album.artist_name}/{album.name}/{filenames[track - 1]}"]).pid
    redis_client.sadd('processes', process_id)
    redis_client.set('track', track)
    return 'OK'

@app.route('/api/status', methods=['GET'])
def api_status():
    process_id = list(redis_client.smembers('processes'))[0]
    process_id = process_id.decode("utf-8")
    child_process_id = os.popen(f"ps --ppid {process_id} -o pid=").read().split("\n")[0].strip()
    if child_process_id:
        return { 'message': 'still playing' }
    else:
        album_id = redis_client.get('album_id').decode('utf-8')
        album = Album.query.get(album_id)
        music_directory = os.getenv('MUSIC_DIRECTORY')
        filenames = os.listdir(f"{music_directory}/{album.artist_name}/{album.name}")
        filenames.sort()
        track = int(redis_client.get('track').decode('utf-8'))
        track += 1
        try:
            next_song_file = filenames[track - 1]
            process_id = Popen(['omxplayer', '-o', 'local', f"{music_directory}/{album.artist_name}/{album.name}/{next_song_file}"]).pid
            redis_client.delete('processes')
            redis_client.sadd('processes', process_id)
            redis_client.set('track', track)
            return { 'message': 'next track' }
        except IndexError:
            albums = Album.query.filter(Album.id != album_id).all()
            random_album = random.choice(albums)
            return { 'message': 'next album', 'albumId': random_album.id }

# admin area:

@app.route('/admin/albums')
def albums_index():
    return render_template('admin/albums_index.html')

@app.route('/api/albums', methods=['GET', 'POST'])
def api_albums_index():
    if request.method == 'POST':
        artist_name = request.form['album[artist_name]']
        name = request.form['album[name]']
        order = 0
        new_album = Album(artist_name=artist_name, name=name, order=order)
        db.session.add(new_album)
        db.session.commit()
    albums = Album.query.all()
    album_dicts = []
    for album in albums:
        dict = album.__dict__
        del dict['_sa_instance_state']
        album_dicts.append(dict)
    result = {}
    result['albums'] = to_camel_case(album_dicts)
    return result

@app.route('/admin/albums/<album_id>')
def album_details(album_id):
    return render_template('admin/album_details.html')

@app.route('/api/albums/<album_id>', methods=['GET', 'PATCH', 'DELETE'])
def api_album_details(album_id):
    if request.method == 'DELETE':
        album = Album.query.get(album_id)
        db.session.delete(album)
        db.session.commit()
        return 'ok'
    elif request.method == 'PATCH':
        album = Album.query.get(album_id)
        album.artist_name = request.form['album[artist_name]']
        album.name = request.form['album[name]']
        album.order = request.form['album[order]']
        db.session.commit()
    album = Album.query.get(album_id)
    album_dict = album.__dict__
    del album_dict['_sa_instance_state']
    for keys in album_dict:
        album_dict[keys] = str(album_dict[keys])
    result = {}
    result['album'] = to_camel_case(album_dict)
    return result
