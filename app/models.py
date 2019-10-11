from app import db

class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True)
    artist_name = db.Column(db.String(128))
    order = db.Column(db.Integer)

    def __repr__(self):
        return '<Album - {}>'.format(self.name)
