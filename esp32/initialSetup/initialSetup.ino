#include <Preferences.h>
#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "LittleFS.h"
#include <Arduino_JSON.h>
#include <DHT.h>
#include <Wire.h>
#include "time.h"
#include <ESP32Servo.h>
#include <Adafruit_Sensor.h>
#include <WebSocketsClient.h>

#define DHTPIN 4
#define sensorLuz 34
#define atuadorLuz 15
#define sensorSolo 32
#define SensorBoia 33
#define DHTTYPE DHT22
#define atuadorBomba 26
#define atuadorServo 27

JsonDocument doc;
AsyncWebServer server(80);

const char* PARAM_SSID = "ssid";
const char* PARAM_PASSWORD = "password";
const char* SSID_PATH = "/ssid.bin";
const char* PASSWORD_PATH = "/password.bin";
const char* SERVER_PATH = "http://192.168.1.177/api/devices/preregister/";
const char* INFO_PATH = "http://192.168.1.177/api/devices/info/%s/";

String ssid;
String password;
HTTPClient http;

IPAddress localIP(192, 168, 1, 200); 
IPAddress localGateway(192, 168, 1, 1); 
IPAddress subnet(255, 255, 0, 0);

WebSocketsClient webSocket;

const char* address = "192.168.1.177";
int port = 80; 
char route[90];
char buffer[65];
char* token = ulltoa(ESP.getEfuseMac(), buffer, 10);
int i = sprintf(route, "/ws/actuations/%s/", token);

float umi;
float temp;
float soilHumidity;
int timestamp;
int valorNivelAgua;
int valorAnalogicLuz;
int valorFirebaseLuz;
int valorAnalogicSolo;
int valorFirebaseSolo;
int sensorFertilizante = 14;
int valorDigitalFertilizante;
int ledOnTime = 0;
int ledOnCurrent = 0;
bool readingsEnabled = false;
unsigned long readingInterval;
unsigned long fertilizingInterval;
unsigned long timerDelay = 18000;
unsigned long sendDataPrevMillis = 0;
const char* ntpServer = "pool.ntp.org";
Servo servoFertilizante;
DHT dht(DHTPIN, DHTTYPE);

bool readWaterLevel(){
  return digitalRead(SensorBoia);
}

float readSoilMoisture(){
  return analogRead(sensorSolo) / 40.95;
}

float readAirHumidity(){
  return dht.readHumidity();
}

float readAirTemperature(){
  return dht.readTemperature();
}

float readAmbientLight(){
  return analogRead(sensorLuz) / 40.95;
}

bool readLed(){
  return digitalRead(atuadorLuz);
}

void getInfo(){
    char infoRoute[200];
    int ii = sprintf(infoRoute, INFO_PATH, token);

    http.begin(String(infoRoute));
    http.addHeader("Content-Type", "application/json");
    String payload;
    StaticJsonDocument<200> doc;
    int httpResponseCode = http.GET();
    if (httpResponseCode != 200){
      Serial.println("Connection error...");
    }
    else{
      readingsEnabled = true;
    }
    payload = http.getString();
    http.end();
    deserializeJson(doc, payload);
    readingInterval = doc["reading_interval"];
    readingInterval = readingInterval * 1000 * 60;
    if (readingInterval == 0){
      readingInterval = 3 * 1000 * 60;
    }
    Serial.println(readingInterval);
    soilHumidity = doc["soil_humidity"];
    fertilizingInterval = doc["fertilizing_interval"];
}

void sendReadings(bool waterLevel, float soilMoisture, float airHumidity, float airTemperature, float ambientLight, bool led){
    String payload;
    StaticJsonDocument<200> doc;
    
    doc["water_level"] = waterLevel;
    doc["token"] = token;
    doc["soil_moisture"] = soilMoisture;
    doc["air_humidity"] = airHumidity;
    doc["air_temperature"] = airTemperature;
    doc["luminosity"] = ambientLight;
    doc["led"] = led;
    serializeJson(doc, payload);
    webSocket.sendTXT(payload);
    Serial.print("Reading: ");
    Serial.println(payload.c_str());
    getInfo();
}

void sendAction(int actuator, int actionId=-1){
    String payload;
    StaticJsonDocument<200> doc;
    
    doc["actuator"] = actuator;
    doc["token"] = token;
    doc["type"] = "action";
    if (actionId >=0){
        doc["action_id"] = actionId;
    }
    serializeJson(doc, payload);
    webSocket.sendTXT(payload);
    Serial.println(payload);
}

void water(){
    digitalWrite(atuadorBomba, HIGH);
    delay(1000);
    digitalWrite(atuadorBomba, LOW);  
}

void ledOn(){
    digitalWrite(atuadorLuz, HIGH);
}

void ledOff(){
    digitalWrite(atuadorLuz, LOW);
}

void fertilize(){
    servoFertilizante.write(0);
    delay(300);
    servoFertilizante.write(90);
}

unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return (0);
  }
  time(&now);
  return now;
}

void hexdump(const void *mem, uint32_t len, uint8_t cols = 16) {
    const uint8_t* src = (const uint8_t*) mem;
    Serial.printf("\n[HEXDUMP] Address: 0x%08X len: 0x%X (%d)", (ptrdiff_t)src, len, len);
    for(uint32_t i = 0; i < len; i++) {
        if(i % cols == 0) {
            Serial.printf("\n[0x%08X] 0x%08X: ", (ptrdiff_t)src, i);
        }
        Serial.printf("%02X ", *src);
        src++;
    }
    Serial.printf("\n");
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {

    int actuator;
    int actionId;
    switch(type) {
        case WStype_DISCONNECTED:
            Serial.printf("[WSc] Disconnected!\n");
            readingsEnabled = false;
            break;
        case WStype_CONNECTED:
            Serial.printf("[WSc] Connected to url: %s\n", payload);
            readingsEnabled = true;

            // send message to server when Connected
            // webSocket.sendTXT("Connected");
            break;
        case WStype_TEXT:
            Serial.printf("[WSc] get text: %s\n", payload);
            deserializeJson(doc, payload);
            actuator = doc["actuator"];
            actionId = doc["action_id"];
            switch(actuator){
              case 0:
                water();
                break;
              case 1:
                ledOn();
                ledOnTime = doc["time"];
                ledOnTime = ledOnTime * 1000 * 60;
                break;
              case 2:
                ledOff();
                break;
              case 3:
                fertilize();
                break;

            }
            sendAction(actuator, actionId);

            break;
        case WStype_BIN:
            Serial.printf("[WSc] get binary length: %u\n", length);
            hexdump(payload, length);

            // send data to server
            // webSocket.sendBIN(payload, length);
            break;
        case WStype_ERROR:
        case WStype_FRAGMENT_TEXT_START:
        case WStype_FRAGMENT_BIN_START:
        case WStype_FRAGMENT:
        case WStype_FRAGMENT_FIN:
            break;
    }

}

void setupWebSocket() {
    Serial.println("Setting up WebSocket client");
    webSocket.begin(address, port, route);
    webSocket.onEvent(webSocketEvent);
    webSocket.setReconnectInterval(5000);
}

unsigned long previousMillis = 0;
const long interval = 10000;
bool initialSetup = true;
char deviceToken[6];

void initLittleFS() {
  if (!LittleFS.begin(true)) {
    Serial.println("An error has occurred while mounting LittleFS");
  }
  Serial.println("LittleFS mounted successfully");
}

String readFile(fs::FS &fs, const char * path){
  Serial.printf("Reading file: %s\r\n", path);

  File file = fs.open(path);
  if(!file || file.isDirectory()){
    Serial.println("- failed to open file for reading");
    return String();
  }
  
  String fileContent;
  while(file.available()){
    fileContent = file.readStringUntil('\n');
    break;     
  }
  return fileContent;
}

void generateRandomString(char *str){
  char * alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  int rnd;

  for(int i = 0; i < 5; i++){
    str[i] = alphabet[random(62)];
  }
  str[5] = '\0';

}

void writeFile(fs::FS &fs, const char * path, const char * message){
  Serial.printf("Writing file: %s\r\n", path);

  File file = fs.open(path, FILE_WRITE);
  if(!file){
    Serial.println("- failed to open file for writing");
    return;
  }
  if(file.print(message)){
    Serial.println("- file written");
  } else {
    Serial.println("- write failed");
  }
}

bool initWiFi() {
  if(ssid=="" || password==""){
    Serial.println("Undefined SSID or IP address.");
    return false;
  }

  WiFi.mode(WIFI_AP_STA);

  if (!WiFi.config(localIP, localGateway, subnet)){
    Serial.println("STA Failed to configure");
    return false;
  }
  WiFi.begin(ssid.c_str(), password.c_str());
  Serial.println("Connecting to WiFi...");

  unsigned long currentMillis = millis();
  previousMillis = currentMillis;

  while(WiFi.status() != WL_CONNECTED) {
    currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
      Serial.println("Failed to connect.");
      return false;
    }
  }

  Serial.println(WiFi.localIP());
  getInfo();

  return true;
}

void setupSensors(){
  dht.begin();
  configTime(0, 0, ntpServer);
  pinMode(sensorSolo, INPUT);
  pinMode(sensorLuz, INPUT);
  pinMode(sensorFertilizante, INPUT);
  pinMode(atuadorLuz, OUTPUT);
  pinMode(atuadorBomba, OUTPUT);
  pinMode(SensorBoia, INPUT);
  servoFertilizante.setPeriodHertz(50);
  servoFertilizante.attach(atuadorServo, 500, 2400);
  servoFertilizante.write(90);
}

void manageReadings(){
    String payload;
    StaticJsonDocument<200> doc;

    bool waterLevel = readWaterLevel();
    float soilMoisture = readSoilMoisture();
    float airHumidity = readAirHumidity();
    float airTemperature = readAirTemperature();
    float ambientLight = readAmbientLight();
    bool led = readLed();

    sendReadings(waterLevel, soilMoisture, airHumidity, airTemperature, ambientLight, led);
    if (soilMoisture < soilHumidity){
        water();
        sendAction(0);
    }
    if (ledOnTime > 0){
        if (ledOnCurrent == 0){
          ledOn();
          sendAction(1);
        }
        if(ledOnCurrent >= ledOnTime){
          ledOff();
          ledOnTime = 0;
          ledOnCurrent = 0;
          sendAction(2);
        }
    }
}


void setup() {
  Serial.begin(115200);

  initLittleFS();


  ssid = readFile(LittleFS, SSID_PATH);
  password = readFile(LittleFS, PASSWORD_PATH);
  Serial.println(ssid);
  Serial.println(password);
  setupSensors();


  if(initWiFi()){
    setupWebSocket();
  }else{
      
    Serial.println("Setting AP (Access Point)");
    WiFi.softAP("ESP-WIFI-MANAGER", NULL);

    IPAddress IP = WiFi.softAPIP();
    Serial.print("AP IP address: ");
    Serial.println(IP); 

    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
      request->send(LittleFS, "/front_wifi_minified.html", "text/html");
    });
    
    server.serveStatic("/", LittleFS, "/");
      
    server.on("/", HTTP_POST, [](AsyncWebServerRequest *request) {
      int params = request->params();
      for(int i=0;i<params;i++){
        const AsyncWebParameter* p = request->getParam(i);
        if(p->isPost()){
          // HTTP POST ssid value
          if (p->name() == PARAM_SSID) {
            ssid = p->value().c_str();
            Serial.print("SSID set to: ");
            Serial.println(ssid);
            // Write file to save value
            writeFile(LittleFS, SSID_PATH, ssid.c_str());
          }
          // HTTP POST pass value
          if (p->name() == PARAM_PASSWORD) {
            password = p->value().c_str();
            Serial.print("Password set to: ");
            Serial.println(password);
            // Write file to save value
            writeFile(LittleFS, PASSWORD_PATH, password.c_str());
          }
        }
      }
      String html1 = readFile(LittleFS, "/wifi_connected_p1.html");
      String html2 = readFile(LittleFS, "/wifi_connected_p2.html");
      generateRandomString(deviceToken);

      request->send(200, "text/html", html1 + deviceToken + html2);
      initialSetup = false;
    });

    server.begin();
  }

}

void loop() {
  if(!initialSetup){
    delay(3000);
    WiFi.begin(ssid, password);
    WiFi.waitForConnectResult();
    http.begin(SERVER_PATH);
    http.addHeader("Content-Type", "application/json");
    String httpRequestData;
    StaticJsonDocument<200> doc;
    doc["token"] = deviceToken;
    Serial.println(deviceToken);
    doc["hash"] = ESP.getEfuseMac();
    serializeJson(doc, httpRequestData);
    Serial.println(httpRequestData);
    int httpResponseCode = http.POST(httpRequestData);
    Serial.println(httpResponseCode);    
    Serial.println(http.errorToString(httpResponseCode).c_str());
    initialSetup = true;
    server.end();
    ESP.restart();
  }
  else{
    if(readingsEnabled && ((millis() - sendDataPrevMillis) > readingInterval)) {
    sendDataPrevMillis = millis();
    manageReadings();
    }
  }
  webSocket.loop();
  delay(500);
}