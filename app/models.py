import os
from app import db

class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)
    artist_name = db.Column(db.String(128), nullable=False)
    order = db.Column(db.Integer, nullable=False)

    def add_songs_to_database():
        music_directory = './music'
        artist_folders = os.listdir(f"{music_directory}")
        for artist_folder in artist_folders:
            if artist_folder != '.DS_Store':
                album_folders = os.listdir(f"{music_directory}/{artist_folder}")
                for album_folder in album_folders:
                    if album_folder != '.DS_Store':
                        record = Album.query.filter_by(artist_name=artist_folder).filter_by(name=album_folder).first()
                        if record != None:
                            print(f"adding {artist_folder}: {album_folder}")

    def __repr__(self):
        return '<Album - {}>'.format(self.name)
