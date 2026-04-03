# Backend_Server/logger.py

from datetime import datetime

LOG_FILE = "../Logs/forensics.log"

def log_event(event_type, message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    log_line = f"[{timestamp}] [{event_type}] {message}\n"

    print(log_line)

    with open(LOG_FILE, "a") as f:
        f.write(log_line)