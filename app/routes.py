from app import app
from flask import render_template

@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/favorites')
def favorites():
    return render_template('favorites.html')

@app.route('/play')
def play():
    return render_template('play.html')
