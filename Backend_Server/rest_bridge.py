import json
import time
import random
import requests

def create_packet():
    threat = random.randint(20, 95)
    threatLevel = "HIGH" if threat > 65 else "ELEVATED" if threat > 35 else "LOW"
    
    return {
        "threatLevel": threatLevel,
        "humanDetected": random.choice([True, False, False]),
        "temperature": round(random.uniform(25.0, 45.0), 1),
        "humidity": random.randint(40, 80),
        "pitch": round(random.uniform(-10.0, 10.0), 1),
        "roll": round(random.uniform(-30.0, 30.0), 1),
        "magneticHeading": random.randint(0, 360),
        "magDeclination": 2.3,
        "latitude": 34.09670 + random.uniform(-0.001, 0.001),
        "longitude": -118.19156 + random.uniform(-0.001, 0.001),
        "speed": round(random.uniform(0.0, 6.0), 1),
        "heading": random.randint(0, 360),
        "threatScore": threat
    }

def main():
    print("[REST_BRIDGE] Starting DIRECT HTTP transmission to local backend...", flush=True)

    while True:
        packet_data = create_packet()
        
        try:
            res = requests.post("http://localhost:5000/api/data", json=packet_data, timeout=2)
            print(f"[SENT HTTP] Status: {res.status_code} | Heat: {packet_data['temperature']} | Threat: {packet_data['threatScore']}", flush=True)
        except Exception as e:
            print(f"[HTTP ERROR] Failed to push data: {e}", flush=True)

        time.sleep(2)

if __name__ == "__main__":
    main()
