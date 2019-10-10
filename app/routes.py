from app import app

@app.route('/')
@app.route('/home')
def home():
    return 'homepage'

@app.route('/favorites')
def favorites():
    return 'favorites'

@app.route('/play')
def play():
    return 'play'
