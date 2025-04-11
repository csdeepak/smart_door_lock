const express = require('express');
const cors = require('cors');
const axios = require('axios');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const WebSocket = require('ws');

// === Configuration ===
const ESP32_IP = '192.168.125.55'; // Your ESP32-CAM IP
const SERIAL_PORT = 'COM9';        // Your Arduino COM port
const API_PORT = 3000;
const WS_PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());

// === Serial Setup ===
const port = new SerialPort.SerialPort({ path: SERIAL_PORT, baudRate: 9600 });
const parser = port.pipe(new Readline.ReadlineParser({ delimiter: '\n' }));

let latestSensorStatus = {
  fingerprint: 'Loading...',
  rfid: 'Loading...',
  camera: 'Loading...',
};

let logs = [];

// === Timestamp Function ===
function timestamp() {
  return new Date().toLocaleString();
}

// === Serial Event Parser ===
parser.on('data', (line) => {
  const entry = line.trim();
  console.log('[Serial]', entry);

  if (entry.includes('RFID Verified')) {
    latestSensorStatus.rfid = 'scanned';
    logs.push({ time: timestamp(), method: 'RFID', status: 'Granted' });
  }

  if (entry.includes('Fingerprint Verified')) {
    latestSensorStatus.fingerprint = 'scanned';
    logs.push({ time: timestamp(), method: 'Fingerprint', status: 'Granted' });
  }

  if (entry.includes('Waiting for RFID')) {
    latestSensorStatus.rfid = 'ready';
  }

  if (entry.includes('Waiting for Fingerprint')) {
    latestSensorStatus.fingerprint = 'ready';
  }

  if (entry.includes('Waiting for Face Scan')) {
    latestSensorStatus.camera = 'scanning';
  }

  if (entry.includes('Access Granted')) {
    latestSensorStatus.camera = 'verified';
    logs.push({ time: timestamp(), method: 'Face', status: 'Granted' });
    logs.push({ time: timestamp(), method: 'System', status: 'Unlocked' }); // ✅ Added
  }

  if (entry.includes('Door Locked')) {
    latestSensorStatus.rfid = 'ready';
    latestSensorStatus.fingerprint = 'ready';
    latestSensorStatus.camera = 'ready';
    logs.push({ time: timestamp(), method: 'System', status: 'Locked' });
  }
  

  if (logs.length > 100) logs.shift();
});

// === REST API Routes ===
app.get('/auth_status', (req, res) => {
  res.json(latestSensorStatus);
});

app.get('/access_logs', (req, res) => {
  res.json(logs);
});

app.get('/sysinfo', async (req, res) => {
  try {
    const response = await axios.get(`http://${ESP32_IP}/sysinfo`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'ESP32 offline' });
  }
});

app.post('/control', async (req, res) => {
  try {
    const { command } = req.body;
    const response = await axios.post(`http://${ESP32_IP}/control`, { command });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'ESP32 command failed' });
  }
});

// === Optional: WebSocket for Face Recognition Stream ===
const wss = new WebSocket.Server({ port: WS_PORT });
wss.on('connection', (ws) => {
  console.log('[WS] Dashboard connected');

  const interval = setInterval(async () => {
    try {
      const response = await axios.get(`http://${ESP32_IP}/recognize`);
      ws.send(JSON.stringify({
        type: 'face_recognition',
        data: response.data,
        timestamp: new Date().toISOString(),
      }));
    } catch (err) {
      ws.send(JSON.stringify({
        type: 'face_recognition',
        error: 'ESP32 not reachable',
        timestamp: new Date().toISOString(),
      }));
    }
  }, 1000);

  ws.on('close', () => {
    console.log('[WS] Dashboard disconnected');
    clearInterval(interval);
  });
});

// === Start Server ===
app.listen(API_PORT, () => {
  console.log(`✅ Middleware API running at http://localhost:${API_PORT}`);
});
