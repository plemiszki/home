from app import app, db
from flask import render_template, jsonify, request
from app.models import Album
from to_camel_case import to_camel_case

@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/play')
def play():
    return render_template('play.html')

@app.route('/albums')
def favorites():
    return render_template('albums.html')

@app.route('/api/albums', methods=['GET', 'POST'])
def api_index():
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
