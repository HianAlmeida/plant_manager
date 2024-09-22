#include <DHT.h>
#include <Wire.h>
#include "time.h"
#include <WiFi.h>
#include <Arduino.h>
#include <ESP32Servo.h>
#include <Adafruit_Sensor.h>
#include <Firebase_ESP_Client.h>
#include "addons/RTDBHelper.h"
#include "addons/TokenHelper.h"


#define DHTPIN 4
#define LedVerde 21
#define sensorLuz 34
#define atuadorLuz 15
#define sensorSolo 32
#define SensorBoia 33
#define DHTTYPE DHT22
#define POUCA_LUZ 100
#define SOLO_SECO 800
#define LedVermelho 19
#define atuadorBomba 26
#define atuadorServo 27
#define SOLO_UMIDO 2000
#define SOLO_MODERADO 1500
#define WIFI_SSID "texaicos"
#define WIFI_PASSWORD "lacucaracha"
#define USER_PASSWORD "v4m0spl4nt4r"
#define USER_EMAIL "josevenancioliveira@gmail.com"
#define API_KEY "AIzaSyBuYJBVxjxoaaa2wfwVXsFzKUNOWim5KWw"
#define DATABASE_URL "https://plantinhas-felizes-default-rtdb.firebaseio.com"


void leituraLuz();
void leituraSolo();
void leituraNivelAgua();
void leituraUmiTempAr();
void leituraFertilizante();


float umi;
float temp;
int timestamp;
int valorNivelAgua;
int valorAnalogicLuz;
int valorFirebaseLuz;
int valorAnalogicSolo;
int valorFirebaseSolo;
int sensorFertilizante = 14;
int valorDigitalFertilizante;
unsigned long timerDelay = 18000;
unsigned long sendDataPrevMillis = 0;
const char* ntpServer = "pool.ntp.org";
String uid;
String databasePath;
String tempPath = "/temperature";
String humPath = "/humidity";
String humSoilPath = "/humidity_soil";
String lightPath = "/light";
String fertilizerPath = "/fertilizer";
String nivelAguaPath = "/water_level";
String timePath = "/timestamp";
String parentPath;
String statusFertilizante = "";
Servo servoFertilizante;
DHT dht(DHTPIN, DHTTYPE);
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseJson json;
FirebaseConfig config;


void initWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
  Serial.println();
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

void setup() {

  Serial.begin(9600);
  initWiFi();
  configTime(0, 0, ntpServer);
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;
  Firebase.reconnectWiFi(true);
  fbdo.setResponseSize(4096);
  config.token_status_callback = tokenStatusCallback;  //see addons/TokenHelper.h
  config.max_token_generation_retry = 5;
  Firebase.begin(&config, &auth);

  Serial.println("Getting User UID");
  while ((auth.token.uid) == "") {
    Serial.println('.');
    delay(1000);
  }

  uid = auth.token.uid.c_str();
  Serial.println("User UID: ");
  Serial.println(uid);

  databasePath = "/UsersData/" + uid + "/readings";

  dht.begin();
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

void loop() {
  
  if (Firebase.ready() && (millis() - sendDataPrevMillis > timerDelay || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    timestamp = getTime();
    Serial.print("time: ");
    Serial.println(timestamp);

    parentPath = databasePath + "/" + String(timestamp);

    leituraLuz();
    delay(1000);
    leituraUmiTempAr();
    delay(1000);
    leituraSolo();
    delay(1000);
    leituraFertilizante();
    delay(1000);
    leituraNivelAgua();

    json.set(timePath, String(timestamp));
    Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, parentPath.c_str(), &json) ? "ok" : fbdo.errorReason().c_str());
  }
}

void leituraNivelAgua() {
  valorNivelAgua = digitalRead(SensorBoia);
  if (valorNivelAgua == HIGH) {
    json.set(nivelAguaPath.c_str(), String("Alto"));
  } else {
    json.set(nivelAguaPath.c_str(), String("Baixo"));
  }
}

void leituraFertilizante() {
  if (Firebase.RTDB.getInt(&fbdo, "/leitura/fertilizante")) {
    if (fbdo.dataTypeEnum() == firebase_rtdb_data_type_integer) {
      valorDigitalFertilizante = fbdo.to<int>();
    }
  } else {
    Serial.println("Erro na leituta do fertilizante");
    Serial.println(fbdo.errorReason());
  }
  if (valorDigitalFertilizante == 1) {
    json.set(fertilizerPath.c_str(), String("Acionado"));
    servoFertilizante.write(0);
    delay(300);
    servoFertilizante.write(90);
    Firebase.RTDB.setInt(&fbdo, "/leitura/fertilizante", 0);
  }
}

void leituraSolo() {
  valorAnalogicSolo = analogRead(sensorSolo);

  if (Firebase.RTDB.getInt(&fbdo, "/leitura/agua")) {
    if (fbdo.dataTypeEnum() == firebase_rtdb_data_type_integer) {

      valorFirebaseSolo = fbdo.to<int>();
    }
  } else {
    Serial.println("Erro na leituta do luz");
    Serial.println(fbdo.errorReason());
  }
  if (valorFirebaseSolo == 1) {
    digitalWrite(atuadorBomba, HIGH);
    digitalWrite(atuadorBomba, LOW);
    Firebase.RTDB.setInt(&fbdo, "/leitura/agua", 0);
  }
  else{
    if (valorAnalogicSolo >= 0 && valorAnalogicSolo < SOLO_SECO) {
      json.set(humSoilPath.c_str(), String("Seco"));
      digitalWrite(atuadorBomba, HIGH);
      delay(1000);
      digitalWrite(atuadorBomba, LOW);
    } else if (valorAnalogicSolo >= SOLO_SECO && valorAnalogicSolo < SOLO_MODERADO) {
      json.set(humSoilPath.c_str(), String("Moderado"));
    } else {
      json.set(humSoilPath.c_str(), String("Umido"));
    }
  }
}

void leituraUmiTempAr() {
  umi = dht.readHumidity();
  temp = dht.readTemperature();
  json.set(tempPath.c_str(), String(temp));
  json.set(humPath.c_str(), String(umi));
}

void leituraLuz() {
  valorAnalogicLuz = analogRead(sensorLuz);

  if (Firebase.RTDB.getInt(&fbdo, "/leitura/luz")) {
    if (fbdo.dataTypeEnum() == firebase_rtdb_data_type_integer) {
      valorFirebaseLuz = fbdo.to<int>();
      Serial.println(fbdo.to<int>());
    }
  } else {
    Serial.println("Erro na leituta do luz");
    Serial.println(fbdo.errorReason());
  }
  if (valorFirebaseLuz == 1) {
    digitalWrite(atuadorLuz, HIGH);
  } else {
    if (valorAnalogicLuz < POUCA_LUZ) {
      json.set(lightPath.c_str(), String("Pouca Luz"));
      digitalWrite(atuadorLuz, HIGH);
    } else {
      json.set(lightPath.c_str(), String("Luz OK"));
      digitalWrite(atuadorLuz, LOW);
    }
  }
}
