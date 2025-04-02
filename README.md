# Smart Door Lock System

## 📌 Description
A multi-factor authentication-based Smart Door Lock System using Arduino Mega 2560, ESP32-CAM, R307 fingerprint sensor, and RC522 RFID module. The system ensures secure access by verifying an RFID card, a fingerprint scan, and facial recognition before unlocking the door.

## 🛠 Features
- RFID authentication with RC522
- Fingerprint verification with R307
- Face recognition using ESP32-CAM
- OLED display for status updates
- Relay-controlled solenoid lock
- Multi-step authentication for enhanced security

---

## 🚀 Installation & Setup

### Prerequisites
Ensure you have the following installed:
- [Arduino IDE](https://www.arduino.cc/en/software)
- [ESP32 Board Package](https://github.com/espressif/arduino-esp32)
- [Node.js & npm](https://nodejs.org/)
- [React.js](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)

### Step 1: Clone Repository
```sh
 git clone https://github.com/your-repo/smart-door-lock.git
 cd smart-door-lock
```

### Step 2: Install Dependencies
#### Backend & Firmware
```sh
 cd firmware
 npm install
```
#### Frontend (React App)
```sh
 cd frontend
 npm install
```

### Step 3: Upload Code
- **ESP32-CAM**: Upload the face recognition firmware using the Arduino IDE.
- **Arduino Mega 2560**: Upload the authentication and locking mechanism code.

---

## 🎮 Usage
### Authentication Flow
1️⃣ Scan an authorized RFID card → Proceed if valid.
2️⃣ Scan a registered fingerprint → Proceed if valid.
3️⃣ Face recognition via ESP32-CAM → Proceed if matched.
4️⃣ Unlock door (Relay & Solenoid activation) → Only if all three checks pass.

### Step-by-Step Execution
#### 🔹 Step 1: Program & Test ESP32-CAM
1️⃣ Connect ESP32-CAM to FTDI → TX → RX, RX → TX, IO0 → GND (for upload).
2️⃣ Upload Face Enrollment Code → Get ESP32 IP Address from Serial Monitor.
3️⃣ Enroll Face via Web Interface → Open ESP32 IP in a browser, click "Enroll Face."
4️⃣ Reconnect ESP32-CAM to Arduino Mega → TX → Pin 17, RX → Pin 16.

#### 🔹 Step 2: Program & Test Arduino Mega
1️⃣ Connect & Enroll Fingerprint (R307) → Upload fingerprint code, enroll fingerprints.
2️⃣ Connect & Enroll RFID (RC522) → Upload RFID code, scan and save valid UIDs.
3️⃣ Test Each Component Individually → Ensure fingerprint and RFID work separately.

#### 🔹 Step 3: Integrate & Execute Authentication
✅ Scan RFID Card → If valid, proceed.
✅ Scan Fingerprint → If valid, proceed.
✅ Verify Face with ESP32-CAM → If matched, proceed.
✅ Unlock Door (Activate Relay & Solenoid Lock) → If all three checks pass.

#### 🔹 Step 4: Final Testing & Deployment
- Test full authentication sequence.
- Securely mount hardware on the door.
- Ensure a stable 12V power supply.
- Implement a backup unlock method (Admin card or Wi-Fi access).

---

## 📜 Circuit Diagram & Connections
Refer to the [circuit diagram PDF](https://github.com/your-repo/smart-door-lock/blob/main/docs/connections.pdf) for detailed wiring and component connections.

---

## 🔗 Source Code
- **Arduino Code**: [Arduino Mega firmware](https://github.com/your-repo/smart-door-lock/blob/main/firmware/arduino)
- **ESP32-CAM Code**: [ESP32-CAM firmware](https://github.com/your-repo/smart-door-lock/blob/main/firmware/esp32)
- **Web UI Source Code**: [React App](https://github.com/your-repo/smart-door-lock/blob/main/frontend)

---

## ⚙️ Configuration
Ensure the correct libraries are installed before compiling:
### Arduino Mega Dependencies
- [Adafruit Fingerprint Sensor Library](https://github.com/adafruit/Adafruit-Fingerprint-Sensor-Library)
- [MFRC522 RFID Library](https://github.com/miguelbalboa/rfid)
- [Wire.h for OLED Display](https://www.arduino.cc/en/reference/wire)

### ESP32-CAM Dependencies
- [ESP32 Camera Library](https://github.com/espressif/esp32-camera)
- [ArduinoJson](https://github.com/bblanchon/ArduinoJson)

---

## 🤝 Contributing
We welcome contributions! Follow these steps:
1. Fork the repository.
2. Create a new branch (`feature-name`).
3. Commit your changes.
4. Push to your fork.
5. Submit a Pull Request.

---

## 📝 License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## 👨‍💻 Authors & Acknowledgements
- **[Your Name]** - Developer & Maintainer
- Special thanks to contributors and open-source libraries used in this project.

---

## 📬 Contact
For support or inquiries, reach out via:
📧 Email: your-email@example.com  
🔗 GitHub Issues: [Report a Bug](https://github.com/your-repo/smart-door-lock/issues)
