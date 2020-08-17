import os
from app import app
from flask_redis import FlaskRedis
redis_client = FlaskRedis(app)

def stop_everything():
    redis_client.set('track', 0)
    lines = os.popen("ps -A | grep omxplayer").read().split("\n")
    for line in lines:
        process_id = line.strip().split(' ')[0]
        os.system(f"kill -9 {process_id}")
    redis_client.delete('processes')
