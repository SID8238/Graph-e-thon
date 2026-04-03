# Backend_Server/main.py
from mqtt_handler import start_mqtt_listener
from logger import log_event

def main():
    print("[SPECTR] Backend Server Started...")
    log_event("SYSTEM_START", "Backend server initialized")

    # Start MQTT listener
    start_mqtt_listener()

if __name__ == "__main__":
    main()