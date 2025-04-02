#include <Adafruit_Fingerprint.h>
#include <Wire.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// =============================
// Pin Definitions
// =============================
#define RST_PIN 5       // Reset pin for RC522
#define SS_PIN 53       // SDA pin for RC522
#define OLED_RESET -1
#define RELAY_PIN 8     // Relay pin for solenoid lock

// OLED Display Setup
Adafruit_SSD1306 display(128, 64, &Wire, OLED_RESET);

// Create MFRC522 instance
MFRC522 mfrc522(SS_PIN, RST_PIN);

// Create fingerprint sensor instance on Serial1
Adafruit_Fingerprint finger(&Serial1);

// RFID Authorized Tag UIDs
byte authorizedUID1[4] = {0x5E, 0x8E, 0x8E, 0x02};  // White Card UID
byte authorizedUID2[4] = {0x63, 0xA3, 0xB2, 0x2C};  // Blue Tag UID

void setup() {
  Serial.begin(9600);
  Serial1.begin(57600);  // Fingerprint Sensor (R307)
  SPI.begin();           // Start SPI for RFID
  mfrc522.PCD_Init();    // Initialize RFID module

  // OLED Display Setup
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED display failed.");
    while (1);
  }
  display.clearDisplay();
  display.display();

  // Initialize relay pin
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);  // Lock initially

  // Initialize fingerprint sensor
  if (finger.verifyPassword()) {
    Serial.println("Fingerprint sensor ready!");
  } else {
    Serial.println("Fingerprint sensor not found.");
    while (1);
  }

  displayStatus("System Ready");
}

// =============================
// Main Loop
// =============================
void loop() {
  // 1. Ask for RFID Tag
  if (checkRFID()) {
    // 2. If RFID Verified → Ask for Fingerprint
    if (waitForFingerprint(15000)) {
      // 3. NEW: Ask for Face Scan (but only wait for 20 seconds)
      displayLargeMessage("Scan Face...");
      Serial.println("Waiting for Face Scan...");

      delay(20000);  // Simulating face scan

      unlockDoor();  // 4. Unlock Door after 20 sec
    } else {
      displayStatus("Fingerprint Failed! Retry.");
      delay(2000);
    }
  } else {
    displayStatus("Unauthorized RFID! Try Again.");
    delay(2000);
  }
}

// =============================
// RFID Authentication
// =============================
bool checkRFID() {
  displayLargeMessage("Scan RFID...");
  Serial.println("Waiting for RFID Tag...");
  
  while (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    // Keep waiting for a valid RFID card
  }

  // Check if scanned tag matches authorized UIDs
  if (checkUID(mfrc522.uid.uidByte, authorizedUID1) || checkUID(mfrc522.uid.uidByte, authorizedUID2)) {
    Serial.println("RFID Verified!");
    displayStatus("RFID Verified!");
    mfrc522.PICC_HaltA();  // Stop RFID communication
    return true;
  }

  Serial.println("Unauthorized RFID Tag!");
  displayStatus("Access Denied (RFID)!");
  delay(2000);
  mfrc522.PICC_HaltA();  // Stop RFID communication
  return false;
}

// Compare UID with authorized UIDs
bool checkUID(byte *readUID, byte *authorizedUID) {
  for (byte i = 0; i < 4; i++) {
    if (readUID[i] != authorizedUID[i]) {
      return false;
    }
  }
  return true;
}

// =============================
// Fingerprint Authentication with Timeout
// =============================
bool waitForFingerprint(unsigned long timeout) {
  displayLargeMessage("Scan Finger...");
  Serial.println("Waiting for Fingerprint...");

  unsigned long startTime = millis();
  while (millis() - startTime < timeout) {
    int id = getFingerprintID();
    if (id > 0) {
      Serial.println("Fingerprint Verified!");
      displayStatus("Fingerprint Verified!");
      return true;
    }
  }

  Serial.println("Fingerprint Timeout! Restarting...");
  displayStatus("Fingerprint Timeout!");
  delay(2000);
  return false;
}

// Get Fingerprint ID
int getFingerprintID() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK) {
    return finger.fingerID;
  }
  return -1;  // Fingerprint not found
}

// =============================
// Unlock the Door
// =============================
void unlockDoor() {
  Serial.println("Access Granted! Unlocking...");
  displayStatus("Access Granted! Unlocking...");

  digitalWrite(RELAY_PIN, HIGH);  // Unlock door
  delay(20000);                   // Keep door unlocked for 20 seconds
  digitalWrite(RELAY_PIN, LOW);   // Lock again

  displayStatus("Door Locked!");
  delay(2000);
}

// =============================
// Display Status on OLED
// =============================
void displayStatus(String message) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.print(message);
  display.display();
  Serial.println(message);
}

// =============================
// Display Large Message on OLED
// =============================
void displayLargeMessage(String message) {
  display.clearDisplay();
  display.setTextSize(2);  // Larger Font Size
  display.setTextColor(WHITE);
  display.setCursor(0, 20);
  display.print(message);
  display.display();
  Serial.println(message);
}