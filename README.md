# Smart Door Lock System

## 📌 Project Overview

A **Smart Door Lock System** integrating multiple authentication methods: **RFID, Fingerprint, and Face Recognition**. The system enhances security by ensuring only authorized individuals can unlock the door.

## 🚀 Features

- **Multi-Factor Authentication**: Uses RFID, fingerprint, and facial recognition.
- **ESP32-CAM Integration**: Face enrollment and recognition.
- **Secure Access Control**: Only unlocks when all three verifications pass.
- **OLED Display**: Displays authentication status.
- **Relay & Solenoid Lock Mechanism**: Controls door locking/unlocking.

## 🛠 Installation & Setup

### Prerequisites

Ensure you have the following installed:

- **[Arduino IDE](https://www.arduino.cc/en/software)**
- **[ESP32 Board Package](https://github.com/espressif/arduino-esp32)**
- **[Node.js](https://nodejs.org/)**
- **[React.js](https://react.dev/)**
- **[Tailwind CSS](https://tailwindcss.com/docs/installation)**

### 🔧 Required Libraries

#### Arduino Mega 2560

Install these libraries via Arduino Library Manager:

- `Adafruit Fingerprint Sensor Library`
- `MFRC522`
- `Adafruit GFX`
- `Adafruit SSD1306`

#### ESP32-CAM

Install these ESP32-specific libraries:

- `WiFi`
- `ESPAsyncWebServer`
- `SPIFFS`

### 🔗 Additional Resources

- **[Circuit Diagram](https://github.com/csdeepak/smart_door_lock/blob/main/CIRCUIT%20DIAGRAM.png)**
- **[Connections PDF](https://github.com/csdeepak/smart_door_lock/blob/main/Connections.pdf)**

## 📜 Step-by-Step Execution for Smart Door Lock System

### 🔹 Step 1: Program & Test ESP32-CAM

1️⃣ Connect ESP32-CAM to FTDI → TX → RX, RX → TX, IO0 → GND (for upload).
2️⃣ Upload Face Enrollment Code → Get ESP32 IP Address from Serial Monitor.
3️⃣ Enroll Face via Web Interface → Open ESP32 IP in a browser, click "Enroll Face."
4️⃣ Reconnect ESP32-CAM to Arduino Mega → TX → Pin 17, RX → Pin 16.

### 🔹 Step 2: Program & Test Arduino Mega

1️⃣ Connect & Enroll Fingerprint (R307) → Upload fingerprint code, enroll fingerprints.
2️⃣ Connect & Enroll RFID (RC522) → Upload RFID code, scan and save valid UIDs.
3️⃣ Test Each Component Individually → Ensure fingerprint and RFID work separately.

### 🔹 Step 3: Integrate & Execute Authentication

1️⃣ Scan RFID Card → If valid, proceed.
2️⃣ Scan Fingerprint → If valid, proceed.
3️⃣ Verify Face with ESP32-CAM → If matched, proceed.
4️⃣ Unlock Door (Activate Relay & Solenoid Lock) → If all three checks pass.

### 🔹 Step 4: Final Testing & Deployment

✅ Test RFID → Fingerprint → Face Recognition → Lock Opens.
✅ Mount hardware securely on the door.
✅ Ensure a stable 12V power supply.
✅ Add a backup unlock method (Admin card or Wi-Fi).

## 💾 Code Repository

- **[Arduino Code - Smart Door Lock](https://github.com/csdeepak/smart_door_lock/tree/main/smart_door_lock_arduino_mega_2560)**
- **[ESP32-CAM Code - Face Recognition](https://github.com/csdeepak/smart_door_lock/tree/main/esp32_cam_code)**

## ⚙️ Configuration

- **Wi-Fi Settings** (for ESP32-CAM)
- **Fingerprint Enrollment** (Stored in Arduino Mega EEPROM)
- **RFID UID Storage** (EEPROM or SD Card)

## 🙌 Authors & Acknowledgments

- **C S Deepak**
- **Chennupati Gunadeep**
- **Bysani Nirvaan**

## 📧 Contact

- **Deepak**: [csdeepak2005@gmail.com](mailto:csdeepak2005@gmail.com)
- **Gunadeep**: [chennupatigunadeep19@gmail.com](mailto:chennupatigunadeep19@gmail.com)
- **Nirvaan**: [nirvaanbysani123@gmail.com](mailto:nirvaanbysani123@gmail.com)
