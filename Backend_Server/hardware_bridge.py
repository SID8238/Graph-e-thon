print("[TRACE] Booting bridge...", flush=True)
import time, json, cv2, threading, requests, base64, ssl
import paho.mqtt.client as mqtt
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
from ultralytics import YOLO

BROKER = "d4152fc4908b486d88b26fefd6dfa7ab.s1.eu.hivemq.cloud"
PORT = 8883
TOPIC = "drone/DRONE_01"
USERNAME = "Drone123"
PASSWORD = "Spectr@123"

KEY = b"DRONE_SECURE_KEY"
IV  = b"INITVECTOR123456"

# Attempt IP Camera Stream connection
latest_frame = None
camera_online = False
cap = None

def cam_thread():
    global latest_frame, camera_online, cap
    print("[SYSTEM] Attempting concurrent connection to Drone IP Camera...", flush=True)
    cap = cv2.VideoCapture("http://192.168.137.165:8080/video")
    while True:
        ret, frame = cap.read()
        if ret:
            latest_frame = frame
            camera_online = True
        else:
            camera_online = False
            time.sleep(1)

threading.Thread(target=cam_thread, daemon=True).start()

print("[SYSTEM] Importing YOLO Model... (This may take a moment to load)", flush=True)
import warnings
warnings.filterwarnings("ignore")
try:
    model = YOLO("yolov8n.pt")
    print("[SYSTEM] YOLO Model loaded successfully!", flush=True)
except Exception as e:
    print(f"[SYSTEM] YOLO failed to load: {e}", flush=True)

def decrypt_packet(enc):
    try:
        enc = enc.strip()
        if len(enc) % 4:
            enc += '=' * (4 - len(enc) % 4)
        raw = base64.b64decode(enc)
        cipher = AES.new(KEY, AES.MODE_CBC, IV)
        return unpad(cipher.decrypt(raw), 16).decode(errors='ignore')
    except:
        return None

def on_message(client, userdata, msg):
    print(f"[CLOUD INBOUND] Received encrypted packet of length {len(msg.payload)}")
    decoded = decrypt_packet(msg.payload.decode())
    if not decoded:
        print("[CLOUD INBOUND] ❌ Decryption Failed (Is the DRONE_SECURE_KEY matching?)")
        return

    start = decoded.find('{')
    end = decoded.rfind('}')
    if start == -1 or end == -1:
        return

    clean = decoded[start:end+1].replace("nan", "0")

    try:
        sensor = json.loads(clean)
    except:
        return

    temp = float(sensor.get("temp", 30))
    humidity = float(sensor.get("humidity", 50))
    tilt = float(sensor.get("tilt", 0))
    magnetic = int(sensor.get("magnetic", 1))
    front = float(sensor.get("frontDist", 150))
    side = float(sensor.get("sideDist", 150))
    gps = sensor.get("gps", "0,0")

    intrusion = False
    cam_status = "CONNECTED"

    # Evaluate Video Feed via YOLO
    if camera_online and latest_frame is not None:
        try:
            results = model.predict(latest_frame, imgsz=320, conf=0.5, classes=[0], verbose=False)
            for r in results:
                if len(r.boxes) > 0:
                    intrusion = True
        except:
            pass
    else:
        cam_status = "NOT CONNECTED"

    # Obstacle mapping
    if front < 30:
        obstacle = "FRONT DETECTED"
    elif side < 30:
        obstacle = "SIDE DETECTED"
    else:
        obstacle = "CLEAR"

    # Danger Assessment Engine
    threat = 0
    if intrusion: threat += 40
    if tilt > 4: threat += 15
    if temp > 30: threat += 10
    if front < 50: threat += 20
    if side < 30: threat += 10
    if magnetic == 0: threat += 5

    if threat > 60:
        level = "HIGH"
    elif threat > 25:
        level = "ELEVATED"
    else:
        level = "LOW"

    if front < 30:
        move = "LEFT"
    elif intrusion:
        move = "LEFT"
    elif tilt > 4:
        move = "RIGHT"
    else:
        move = "FORWARD"

    # --- ROUTE TO NODE.JS WEB DASHBOARD ---
    lat, lng = 0.0, 0.0
    if "," in gps:
        try:
            parts = gps.split(',')
            lat, lng = float(parts[0]), float(parts[1])
        except:
            pass

    payload = {
        "threatLevel": level,
        "humanDetected": intrusion,
        "temperature": temp,
        "humidity": humidity,
        "pitch": tilt,
        "roll": 0.0,
        "latitude": lat,
        "longitude": lng,
        "threatScore": threat,
        "magneticHeading": 0 if magnetic == 1 else 180,
        "magnetic": magnetic,
        "frontDist": front,
        "sideDist": side,
        "obstacle": obstacle,
        "move": move,
        "speed": 0,
        "heading": 0
    }

    try:
        requests.post("http://localhost:5000/api/data", json=payload, timeout=2)
    except Exception as e:
        pass

    print("\n---- SECURE TELEMETRY SYNCED TO WEB ----")
    print("Camera Status  :", cam_status)
    print("Human Detected :", "YES" if intrusion else "NO")
    print("Temperature    :", temp, "C")
    print("Humidity       :", humidity, "%")
    print("Tilt           :", tilt)
    print("Magnetic       :", "METAL DETECTED" if magnetic == 0 else "NORMAL")
    print("Obstacle       :", obstacle)
    print("GPS            :", gps)
    print("Threat Score   :", threat)
    print("Threat Level   :", level)
    print("----------------------------------------")

client = mqtt.Client()
client.username_pw_set(USERNAME, PASSWORD)
client.tls_set(cert_reqs=ssl.CERT_NONE)

client.on_message = on_message

print("Connecting to HiveMQ Hardware Broker...")
client.connect(BROKER, PORT)
client.subscribe(TOPIC)

print("AI Hardware Bridge Server Ready — RUNNING YOLOv8")
client.loop_forever()
