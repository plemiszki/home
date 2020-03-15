import os
import glob
import math
import json
import random
import requests
from google.transit import gtfs_realtime_pb2
from google.protobuf import json_format
from app import app, db
from flask import render_template, jsonify, request, redirect
from app.utils import stop_everything
from app.models import Album
from to_camel_case import to_camel_case
from subprocess import Popen
from flask_redis import FlaskRedis
redis_client = FlaskRedis(app)
from datetime import datetime, timezone, timedelta
from dateutil import tz

if app.config['ENV'] == 'production':
    os.system('modprobe w1-gpio')
    os.system('modprobe w1-therm')
    base_dir = '/sys/bus/w1/devices/'
    device_folder = glob.glob(base_dir + '28*')[0]
    device_file = device_folder + '/w1_slave'

@app.route('/')
def home():
    return render_template('public/home.html')

@app.route('/music/modern')
def music_modern():
    stop_everything()
    albums = Album.query.filter(Album.category == '1').order_by('artist_name', 'name').all()
    return render_template('public/music/modern.html', albums=albums)

@app.route('/music/classical')
def music_classical():
    stop_everything()
    albums = Album.query.filter(Album.category == '2').order_by('artist_name', 'name').all()
    return render_template('public/music/classical.html', albums=albums)

@app.route('/music/now_playing')
def now_playing():
    currently_playing_album_id = redis_client.get('album_id')
    category = request.args.get('category')
    if currently_playing_album_id == None:
        return redirect(f"/music/{category}")
    else:
        currently_playing_album_id = currently_playing_album_id.decode('utf-8')
        album = Album.query.get(currently_playing_album_id)
        if ['modern', 'classical'][album.category - 1] == category:
            return redirect(f"/music/play/{currently_playing_album_id}")
        else:
            return redirect(f"/music/{category}")

@app.route('/music/play/<album_id>')
def play(album_id):
    music_directory = os.getenv('MUSIC_DIRECTORY')
    currently_playing_album_id = redis_client.get('album_id')
    if currently_playing_album_id == None or currently_playing_album_id.decode('utf-8') != album_id:
        stop_everything()
        album = Album.query.get(album_id)
        filenames = os.listdir(f"{music_directory}/{album.artist_name}/{album.name}")
        filenames.sort()
        song_titles = map(lambda song_title: ' '.join('.'.join(song_title.split('.')[:-1]).split(' ')[1:]), filenames)
        process_id = Popen(['omxplayer', '-o', 'local', f"{music_directory}/{album.artist_name}/{album.name}/{filenames[0]}"]).pid
        redis_client.sadd('processes', process_id)
        redis_client.set('album_id', album.id)
        redis_client.set('track', 1)
    else:
        album = Album.query.get(currently_playing_album_id.decode('utf-8'))
        filenames = os.listdir(f"{music_directory}/{album.artist_name}/{album.name}")
        filenames.sort()
        song_titles = map(lambda song_title: ' '.join('.'.join(song_title.split('.')[:-1]).split(' ')[1:]), filenames)
    return render_template('/public/music/play.html', album=album, song_titles=song_titles)

@app.route('/mta')
def mta():
    feed = gtfs_realtime_pb2.FeedMessage()
    mta_api_key = os.getenv('MTA_API_KEY')
    data = []
    q_response = requests.get(f"http://datamine.mta.info/mta_esi.php?key={mta_api_key}&feed_id=16", allow_redirects=True)
    data = process_mta_response(q_response, feed, 'Q', data)
    b_response = requests.get(f"http://datamine.mta.info/mta_esi.php?key={mta_api_key}&feed_id=21", allow_redirects=True)
    data = process_mta_response(b_response, feed, 'B', data)
    data.sort(key=lambda x: x['eta_minutes'])
    return render_template('/public/mta.html', data=data)

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
            albums = Album.query.filter(Album.id != album_id, Album.category == album.category).all()
            random_album = random.choice(albums)
            return { 'message': 'next album', 'albumId': random_album.id }

@app.route('/api/indoor_temp', methods=['GET'])
def api_indoor_temp():
    temp_c, temp_f = read_temp() if app.config['ENV'] == 'production' else ['TEMP_C', 'TEMP_F']
    return { 'tempC': temp_c, 'tempF': temp_f }

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
        dict['category'] = ['Modern', 'Classical'][album.category - 1]
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
        album.category = request.form['album[category]']
        db.session.commit()
    album = Album.query.get(album_id)
    album_dict = album.__dict__
    del album_dict['_sa_instance_state']
    for keys in album_dict:
        album_dict[keys] = str(album_dict[keys])
    result = {}
    result['album'] = to_camel_case(album_dict)
    return result

# helper methods:

def process_mta_response(response, feed, train, output):
    try:
        feed.ParseFromString(response.content)
    except:
        return []
    for entity in feed.entity:
        if entity.HasField('trip_update') and entity.trip_update.trip.route_id == train:
            obj = json.loads(json_format.MessageToJson(entity.trip_update))
            if 'stopTimeUpdate' in obj:
                for stop_time in obj['stopTimeUpdate']:
                    if stop_time['stopId'] == 'D26N':
                        departure_utc_naive = datetime.utcfromtimestamp(int(stop_time['departure']['time']))
                        departure_utc_aware = departure_utc_naive.replace(tzinfo=timezone.utc)
                        depature_local = departure_utc_aware.astimezone(tz.gettz('America/New_York'))
                        now_utc_naive = datetime.utcnow()
                        if departure_utc_naive > now_utc_naive:
                            eta_minutes = (departure_utc_naive - now_utc_naive).seconds // 60
                            walk_time = int(os.getenv(f"{train}_TRAIN_WALK_TIME"))
                            leave_at_utc_naive = departure_utc_naive - timedelta(seconds=walk_time)
                            leave_at_utc_aware = leave_at_utc_naive.replace(tzinfo=timezone.utc)
                            leave_at_local = leave_at_utc_aware.astimezone(tz.gettz('America/New_York'))
                            leave_in = (leave_at_utc_naive - now_utc_naive).seconds // 60
                            if leave_at_utc_naive > now_utc_naive:
                                output.append({
                                    'train': train,
                                    'time': depature_local.strftime('%-l:%M'),
                                    'eta_minutes': eta_minutes,
                                    'leave_at': leave_at_local.strftime('%-l:%M'),
                                    'leave_in': leave_in
                                })
    return output

def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0
        return math.floor(temp_c), math.floor(temp_f)

def read_temp_raw():
    f = open(device_file, 'r')
    lines = f.readlines()
    f.close()
    return lines
