#include <Preferences.h>
#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include "LittleFS.h"

AsyncWebServer server(80);

const char* PARAM_SSID = "ssid";
const char* PARAM_PASSWORD = "password";
const char* SSID_PATH = "/ssid.bin";
const char* PASSWORD_PATH = "/password.bin";

String ssid;
String password;

IPAddress localIP(192, 168, 1, 200); 
IPAddress localGateway(192, 168, 1, 1); 
IPAddress subnet(255, 255, 0, 0);

unsigned long previousMillis = 0;
const long interval = 10000;

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

  WiFi.mode(WIFI_STA);

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


    server.begin();
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
      request->send(200, "text/plain", "Pronto. O dispositivo irá reiniciar e se conectar a rede informada.");
      delay(3000);
      ESP.restart();
      
      Serial.println(WiFi.localIP());
    });
    server.begin();
  }

}

void loop() {

}