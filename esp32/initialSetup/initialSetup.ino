#include <Preferences.h>
#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "LittleFS.h"
#include <Arduino_JSON.h>


#include <WebSocketsClient.h>

#define WIFI_SSID "pasteizinhos"
#define WIFI_PASSWORD "chamasnobuia"
JsonDocument doc;

AsyncWebServer server(80);

const char* PARAM_SSID = "ssid";
const char* PARAM_PASSWORD = "password";
const char* SSID_PATH = "/ssid.bin";
const char* PASSWORD_PATH = "/password.bin";
const char* SERVER_PATH = "http://192.168.1.177/api/devices/preregister/";

String ssid;
String password;
HTTPClient http;


IPAddress localIP(192, 168, 1, 200); 
IPAddress localGateway(192, 168, 1, 1); 
IPAddress subnet(255, 255, 0, 0);

// void sendReadings(){
//     String httpRequestData;
//     StaticJsonDocument<200> doc;
//     doc["state"] = 1;
//     doc["device"] = "esp";
//     serializeJson(doc, httpRequestData);
//     webSocket.sendTXT(httpRequestData);
// }


WebSocketsClient webSocket;

const char* address = "192.168.1.177";
int port = 80; // Change this to the port your server is running on.
char route[90];
char buffer[65];
int i = sprintf(route, "/ws/actuations/%s/", ulltoa(ESP.getEfuseMac(), buffer, 10));

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

    int state;
    char * actuator;
    switch(type) {
        case WStype_DISCONNECTED:
            Serial.printf("[WSc] Disconnected!\n");
            break;
        case WStype_CONNECTED:
            Serial.printf("[WSc] Connected to url: %s\n", payload);

            // send message to server when Connected
            // webSocket.sendTXT("Connected");
            break;
        case WStype_TEXT:
            Serial.printf("[WSc] get text: %s\n", payload);
            deserializeJson(doc, payload);
            // actuator = doc["actuator"];
            state = doc["state"];
            // Serial.println(actuator);
            Serial.println(state);

            // send message to server
            // webSocket.sendTXT("message here");
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
    // server address, port and URL
    webSocket.begin(address, port, route);

    // event handler
    webSocket.onEvent(webSocketEvent);

    // use HTTP Basic Authorization this is optional remove if not needed
    // webSocket.setAuthorization("user", "Password");

    // try every 5000 again if connection has failed
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
  return true;
}


void setup() {
  Serial.begin(115200);

  initLittleFS();


  ssid = readFile(LittleFS, SSID_PATH);
  password = readFile(LittleFS, PASSWORD_PATH);
  Serial.println(ssid);
  Serial.println(password);

  if(initWiFi()) {
    // Route for root / web page
    // server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    //   request->send(LittleFS, "/index.html", "text/html", false, processor);
    // });
    // server.serveStatic("/", LittleFS, "/");
    
    // // Route to set GPIO state to HIGH
    // server.on("/on", HTTP_GET, [](AsyncWebServerRequest *request) {
    //   digitalWrite(ledPin, HIGH);
    //   request->send(LittleFS, "/index.html", "text/html", false, processor);
    // });

    // // Route to set GPIO state to LOW
    // server.on("/off", HTTP_GET, [](AsyncWebServerRequest *request) {
    //   digitalWrite(ledPin, LOW);
    //   request->send(LittleFS, "/index.html", "text/html", false, processor);
    // });


    // server.begin();
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
    // ESP.restart();
    initialSetup = true;
    server.end();
  }
  // else{

  // }
  webSocket.loop();
  delay(500);
}