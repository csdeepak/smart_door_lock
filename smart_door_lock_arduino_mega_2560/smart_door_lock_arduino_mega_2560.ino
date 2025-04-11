#include <Adafruit_Fingerprint.h>
#include <Wire.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// =============================
// Pin Definitions
// =============================
#define RST_PIN 5
#define SS_PIN 53
#define OLED_RESET -1
#define RELAY_PIN 6   // Relay control pin

Adafruit_SSD1306 display(128, 64, &Wire, OLED_RESET);
MFRC522 mfrc522(SS_PIN, RST_PIN);
Adafruit_Fingerprint finger(&Serial1);

byte authorizedUID1[4] = {0x5E, 0x8E, 0x8E, 0x02};  // White Card
byte authorizedUID2[4] = {0x63, 0xA3, 0xB2, 0x2C};  // Blue Tag

void setup() {
  Serial.begin(9600);
  Serial1.begin(57600);
  SPI.begin();
  mfrc522.PCD_Init();

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED display failed.");
    while (1);
  }

  display.clearDisplay();
  display.display();

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);  // 🔁 Relay OFF initially (active LOW logic)

  if (finger.verifyPassword()) {
    Serial.println("Fingerprint sensor ready!");
  } else {
    Serial.println("Fingerprint sensor not found.");
    while (1);
  }

  displayStatus("System Ready");
}

void loop() {
  if (checkRFID()) {
    if (waitForFingerprint(15000)) {
      displayLargeMessage("Scan Face...");
      Serial.println("Waiting for Face Scan...");
      delay(20000);  // Simulated face scan

      unlockDoor();  // 🔓 Unlock after all 3 steps
    } else {
      displayStatus("Fingerprint Failed! Retry.");
      delay(2000);
    }
  } else {
    displayStatus("Unauthorized RFID! Try Again.");
    delay(2000);
  }
}

bool checkRFID() {
  displayLargeMessage("Scan RFID...");
  Serial.println("Waiting for RFID Tag...");

  while (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    // Wait for card
  }

  if (checkUID(mfrc522.uid.uidByte, authorizedUID1) || checkUID(mfrc522.uid.uidByte, authorizedUID2)) {
    Serial.println("RFID Verified!");
    displayStatus("RFID Verified!");
    mfrc522.PICC_HaltA();
    return true;
  }

  Serial.println("Unauthorized RFID Tag!");
  displayStatus("Access Denied (RFID)!");
  delay(2000);
  mfrc522.PICC_HaltA();
  return false;
}

bool checkUID(byte *readUID, byte *authorizedUID) {
  for (byte i = 0; i < 4; i++) {
    if (readUID[i] != authorizedUID[i]) {
      return false;
    }
  }
  return true;
}

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

int getFingerprintID() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK) {
    return finger.fingerID;
  }
  return -1;
}

void unlockDoor() {
  Serial.println("Access Granted! Unlocking...");
  displayStatus("Access Granted! Unlocking...");

  digitalWrite(RELAY_PIN, LOW);   // 🔓 Relay ON → Unlock door
  delay(20000);                   // Wait 20 sec
  digitalWrite(RELAY_PIN, HIGH);  // 🔒 Relay OFF → Lock again

  displayStatus("Door Locked!");
  delay(2000);
}

void displayStatus(String message) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.print(message);
  display.display();
  Serial.println(message);
}

void displayLargeMessage(String message) {
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(0, 20);
  display.print(message);
  display.display();
  Serial.println(message);
}