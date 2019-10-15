from app import app, db
from flask import render_template, jsonify, request
from app.models import Album
from to_camel_case import to_camel_case

@app.route('/')
@app.route('/home')
def home():
    albums = Album.query.order_by('artist_name', 'name').all()
    return render_template('home.html', albums=albums)

@app.route('/play')
def play():
    return render_template('play.html')

@app.route('/albums')
def albums_index():
    return render_template('albums_index.html')

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

@app.route('/albums/<album_id>')
def album_details(album_id):
    return render_template('album_details.html')

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
