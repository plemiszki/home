from app import app
from flask_redis import FlaskRedis
redis_client = FlaskRedis(app)

def stop_everything():
    process_ids = list(redis_client.smembers('processes'))
    for process_id in process_ids:
        process_id = process_id.decode("utf-8")
        child_process_id = os.popen(f"ps --ppid {process_id} -o pid=").read().split("\n")[0].strip()
        os.system(f"kill -9 {child_process_id}")
    redis_client.delete('processes')
