// #include <WiFi.h>
// #include <ArduinoWebsockets.h>
// #include <ArduinoJson.h> // Arduino JSON Library


// const char* ssid = "pasteizinhos"; //Enter SSID
// const char* password = "chamasnobuia"; //Enter Password
// const char* websockets_server_host = "192.168.1.130"; //Enter server adress
// const uint16_t websockets_server_port = 8000; // Enter server port
// const char* websockets_server_uri = "/ws/actuations/esp32/";

// using namespace websockets;

// WebsocketsClient client;
// JsonDocument doc;
// void setup() {
//     Serial.begin(115200);
//     // Connect to wifi
//     WiFi.begin(ssid, password);

//     // Wait some time to connect to wifi
//     for(int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++) {
//         Serial.print(".");
//         delay(1000);
//     }

//     // Check if connected to wifi
//     if(WiFi.status() != WL_CONNECTED) {
//         Serial.println("No Wifi!");
//         return;
//     }
//     Serial.println("");
//     Serial.println("Connected to Wifi, Connecting to server.");
//     // try to connect to Websockets server

//     Serial.println(WiFi.localIP());
//     delay(5000);

//     while(!client.connect(websockets_server_host, websockets_server_port, websockets_server_uri)) {
//         Serial.println("Not Connected!");
//         delay(1000);
//     }
//         Serial.println("Connected!");
//         // client.send("Hello Server");
//     // run callback when messages are received
//     client.onMessage([&](WebsocketsMessage message){
//         Serial.print("Got Message: ");
//         deserializeJson(doc, message.data());

//         Serial.println(message.data());
//         String actuator = doc["actuator"];
//         int state = doc["state"];
//         Serial.println(actuator);
//         Serial.println(state);
//     });
// }

// void loop() {
//     // let the websockets client check for incoming messages
//     if(client.available()) {
//         client.poll();
//     }else{
//       while(!client.connect(websockets_server_host, websockets_server_port, websockets_server_uri)) {
//         Serial.println("Not Connected!");
//         delay(1000);
//       }
//         Serial.println("Connected!");
//         // client.send("Hello Server");
//     }
//     delay(500);
// }






/* ESP32 WebSocket client example
 *
 *  https://wokwi.com/projects/384795514755693569
 *
 *  Uses the ArduinoWebSockets library: https://github.com/Links2004/arduinoWebSockets/
 *
 *  Based on this example: https://github.com/Links2004/arduinoWebSockets/blob/master/examples/esp32/WebSocketClient/WebSocketClient.ino
 *
 *
 *  To test, you need the Wokwi IoT Gateway, as explained here:
 *
 *  https://docs.wokwi.com/guides/esp32-wifi#the-private-gateway
 *
 *  Note that the IoT Gateway requires a Wokwi Club subscription.
 *  To purchase a Wokwi Club subscription, go to https://wokwi.com/club
 */

#include <WiFi.h>
#include <WebSocketsClient.h>

#define WIFI_SSID "pasteizinhos"
#define WIFI_PASSWORD "chamasnobuia"
#include <ArduinoJson.h> // Arduino JSON Library
JsonDocument doc;

// Defining the WiFi channel speeds up the connection:
// #define WIFI_CHANNEL 6

WebSocketsClient webSocket;

const char* address = "192.168.1.130";
int port = 8000; // Change this to the port your server is running on.
const char* route = "/ws/actuations/esp32/";

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

void setup(void) {
    Serial.begin(115200);

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to WiFi ");
    Serial.print(WIFI_SSID);
    // Wait for connection
    while (WiFi.status() != WL_CONNECTED) {
        delay(100);
        Serial.print(".");
    }
    Serial.println(" Connected!");

    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    setupWebSocket();
}

void loop(void) {
    webSocket.loop();
}

