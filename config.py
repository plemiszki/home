import os
APP_ROOT = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL') or 'sqlite:///' + os.path.join(APP_ROOT, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
