import json
import hashlib
import base64
import time
import random

import paho.mqtt.client as mqtt
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

# ================= CONFIG =================
BROKER = "d4152fc4908b486d88b26fefd6dfa7ab.s1.eu.hivemq.cloud"
PORT = 8883
TOPIC = "spectr/telemetry"

USERNAME = "spectr_user"
PASSWORD = "Strongpassword123"

KEY = b'12345678901234567890123456789012'
IV = b'1234567890123456'
# ==========================================


def create_packet():
    threat = random.randint(20, 95)
    threatLevel = "HIGH" if threat > 65 else "ELEVATED" if threat > 35 else "LOW"
    
    data = {
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

    salt = random.randint(1000, 9999)

    combined = json.dumps(data) + str(salt)
    hash_val = hashlib.sha512(combined.encode()).hexdigest()

    packet = {
        "data": data,
        "salt": salt,
        "hash": hash_val
    }

    return json.dumps(packet)


def encrypt_packet(packet):
    cipher = AES.new(KEY, AES.MODE_CBC, IV)
    encrypted = cipher.encrypt(pad(packet.encode(), AES.block_size))
    return base64.b64encode(encrypted).decode()


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("[SENDER] Connected to MQTT broker ✅")
    else:
        print("[SENDER] Connection failed ❌ Code:", rc)


import requests

def main():
    print("[SENDER] Starting DIRECT HTTP transmission to local backend...", flush=True)

    while True:
        packet_str = create_packet()
        packet_data = json.loads(packet_str)["data"]
        
        try:
            res = requests.post("http://localhost:5000/api/data", json=packet_data, timeout=2)
            print(f"[SENT HTTP] Status: {res.status_code} | Heat: {packet_data['temperature']} | Threat: {packet_data['threatScore']}", flush=True)
        except Exception as e:
            print(f"[HTTP ERROR] Failed to push data: {e}", flush=True)

        time.sleep(2)

if __name__ == "__main__":
    main()