const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spectar';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ─── Schemas ───────────────────────────────────────────────────────────────
const SensorDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  threatLevel: { type: String, enum: ['LOW', 'ELEVATED', 'HIGH'], default: 'LOW' },
  humanDetected: { type: Boolean, default: false },
  temperature: { type: Number },
  humidity: { type: Number },
  pitch: { type: Number },
  roll: { type: Number },
  magneticHeading: { type: Number },
  magDeclination: { type: Number },
  latitude: { type: Number },
  longitude: { type: Number },
  speed: { type: Number },
  heading: { type: Number },
  threatScore: { type: Number, min: 0, max: 100 }
});

const AlertSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  type: { type: String },
  message: { type: String },
  severity: { type: String, enum: ['INFO', 'WARNING', 'CRITICAL'] }
});

const SensorData = mongoose.model('SensorData', SensorDataSchema);
const Alert = mongoose.model('Alert', AlertSchema);

// ─── REST Routes ────────────────────────────────────────────────────────────
app.get('/api/sensor/latest', async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ timestamp: -1 });
    res.json(latest || generateMockData());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/sensor/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 60;
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(limit);
    res.json(data.reverse());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/sensor', async (req, res) => {
  try {
    const entry = new SensorData(req.body);
    await entry.save();
    broadcastToClients({ type: 'SENSOR_UPDATE', data: entry });
    res.status(201).json(entry);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 }).limit(20);
    res.json(alerts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/alerts', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    broadcastToClients({ type: 'ALERT', data: alert });
    res.status(201).json(alert);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime(), dbState: mongoose.connection.readyState });
});

// ─── WebSocket ──────────────────────────────────────────────────────────────
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`Client connected. Total: ${clients.size}`);

  ws.send(JSON.stringify({ type: 'CONNECTED', message: 'SPECTAR system online' }));

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`Client disconnected. Total: ${clients.size}`);
  });

  ws.on('error', () => clients.delete(ws));
});

function broadcastToClients(data) {
  const msg = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}

// ─── Simulator (for demo when no hardware connected) ─────────────────────
let simLat = 34.1005;
let simLng = -118.3250;
let simHeading = 0;
let threatHistory = [];

function generateMockData() {
  simHeading = (simHeading + (Math.random() * 10 - 5) + 360) % 360;
  simLat += (Math.cos((simHeading * Math.PI) / 180) * 0.0001);
  simLng += (Math.sin((simHeading * Math.PI) / 180) * 0.0001);

  const score = Math.random() * 100;
  threatHistory.push(score);
  if (threatHistory.length > 60) threatHistory.shift();

  const threatLevel = score > 65 ? 'HIGH' : score > 35 ? 'ELEVATED' : 'LOW';
  const humanDetected = score > 55 || Math.random() > 0.7;

  return {
    timestamp: new Date(),
    threatLevel,
    humanDetected,
    temperature: +(20 + Math.random() * 15).toFixed(1),
    humidity: +(40 + Math.random() * 40).toFixed(0),
    pitch: +(Math.random() * 10 - 5).toFixed(1),
    roll: +(Math.random() * 10 - 5).toFixed(1),
    magneticHeading: +simHeading.toFixed(0),
    magDeclination: 2.3,
    latitude: +simLat.toFixed(6),
    longitude: +simLng.toFixed(6),
    speed: +(Math.random() * 5).toFixed(1),
    heading: +simHeading.toFixed(0),
    threatScore: +score.toFixed(1),
    threatHistory: [...threatHistory]
  };
}

// Push simulated data every 2 seconds (disabled by default)
if (process.env.SIMULATE === 'true') {
  setInterval(async () => {
    const data = generateMockData();
    try {
      const entry = new SensorData(data);
      await entry.save();
    } catch (e) { /* ignore */ }
    broadcastToClients({ type: 'SENSOR_UPDATE', data });
  }, 2000);
}

// 🛑 REAL DATA MODE: Node.js natively handles the HiveMQ connection and AES decryption to bypass Python socket deadlocks!

const mqtt = require('mqtt');
const crypto = require('crypto');

let latestVisionStatus = { humanDetected: false, camStatus: "NOT CONNECTED" };

// AES Config
const KEY = Buffer.from('DRONE_SECURE_KEY', 'utf8');
const IV = Buffer.from('INITVECTOR123456', 'utf8');

function decryptPacket(enc) {
  try {
    const raw = Buffer.from(enc.trim(), 'base64');
    const decipher = crypto.createDecipheriv('aes-128-cbc', KEY, IV);
    decipher.setAutoPadding(true);
    let decrypted = decipher.update(raw, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    return null;
  }
}

app.post("/api/vision", (req, res) => {
  latestVisionStatus = req.body;
  res.status(200).send("Vision Layer Updated");
});

console.log("Connecting natively to HiveMQ Drone Cloud...");
const mqttClient = mqtt.connect('mqtts://d4152fc4908b486d88b26fefd6dfa7ab.s1.eu.hivemq.cloud:8883', {
  username: 'Drone123',
  password: 'Spectr@123',
  rejectUnauthorized: false
});

mqttClient.on('connect', () => {
  console.log("✅ NodeJS Hardware Cloud Bridge Connected!");
  mqttClient.subscribe('drone/DRONE_01');
});

mqttClient.on('message', async (topic, message) => {
  const decoded = decryptPacket(message.toString());
  if (!decoded) return;
  
  const start = decoded.indexOf('{');
  const end = decoded.lastIndexOf('}');
  if (start === -1 || end === -1) return;
  
  const clean = decoded.substring(start, end + 1).replace(/nan/g, "0");
  try {
    const sensor = JSON.parse(clean);
    
    const temp = parseFloat(sensor.temp || 30);
    const humidity = parseFloat(sensor.humidity || 50);
    const tilt = parseFloat(sensor.tilt || 0);
    const magnetic = parseInt(sensor.magnetic || 1);
    const front = parseFloat(sensor.frontDist || 150);
    const side = parseFloat(sensor.sideDist || 150);
    const gps = sensor.gps || "0,0";
    
    let obstacle = "CLEAR";
    if (front < 30) obstacle = "FRONT DETECTED";
    else if (side < 30) obstacle = "SIDE DETECTED";
    
    let threat = 0;
    if (latestVisionStatus.humanDetected) threat += 40;
    if (tilt > 4) threat += 15;
    if (temp > 30) threat += 10;
    if (front < 50) threat += 20;
    if (side < 30) threat += 10;
    if (magnetic === 0) threat += 5;
    
    let level = "LOW";
    if (threat > 60) level = "HIGH";
    else if (threat > 25) level = "ELEVATED";
    
    let move = "FORWARD";
    if (front < 30) move = "LEFT";
    else if (latestVisionStatus.humanDetected) move = "LEFT";
    else if (tilt > 4) move = "RIGHT";
    
    let lat = 0.0, lng = 0.0;
    if (gps.includes(',')) {
      const parts = gps.split(',');
      lat = parseFloat(parts[0]);
      lng = parseFloat(parts[1]);
    }
    
    const payload = {
      threatLevel: level,
      humanDetected: latestVisionStatus.humanDetected,
      temperature: temp,
      humidity: humidity,
      pitch: tilt,
      roll: 0.0,
      latitude: lat,
      longitude: lng,
      threatScore: threat,
      magneticHeading: magnetic === 1 ? 0 : 180,
      magnetic: magnetic,
      frontDist: front,
      sideDist: side,
      obstacle: obstacle,
      move: move,
      speed: 0,
      heading: 0
    };
    
    console.log("🔥 [HARDWARE EVENT] Processed incoming AES HiveMQ Packet!");
    broadcastToClients({ type: 'SENSOR_UPDATE', data: payload });
    
    try {
      SensorData.create(payload).catch(e => {});
    } catch (e) { }

  } catch(e) { }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`SPECTAR server running on port ${PORT}`));