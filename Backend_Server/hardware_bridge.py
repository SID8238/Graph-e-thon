print("[TRACE] Booting YOLO Vision Pipeline... (Bypassing MQTT entirely)", flush=True)
import time, cv2, threading, requests
from ultralytics import YOLO

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

print("[SYSTEM] Importing YOLO Model... (Downloading lightweight weights if needed)", flush=True)
import warnings
warnings.filterwarnings("ignore")
try:
    model = YOLO("yolov8n.pt")
    print("[SYSTEM] YOLO Model loaded successfully!", flush=True)
except Exception as e:
    print(f"[SYSTEM] YOLO failed to load: {e}", flush=True)

print("✅ AI Vision Engine Ready — Piping detections to Backend natively.")

while True:
    time.sleep(1.0)
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

    payload = {
        "humanDetected": intrusion,
        "camStatus": cam_status
    }
    
    try:
        requests.post("http://localhost:5000/api/vision", json=payload, timeout=2)
    except:
        pass
