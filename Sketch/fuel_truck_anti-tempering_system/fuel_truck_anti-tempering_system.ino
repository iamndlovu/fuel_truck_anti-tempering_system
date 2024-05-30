#include <Arduino.h>
#include <ArduinoHttpClient.h>
#include <WiFi.h>
#include <NewPing.h>
#include <TinyGPSPlus.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include "HX711.h"
/*****************************************************************************
 *  Pressure -> Pin 35                                                       *
 *  Valve -> Pin 19                                                          *
 *  Ultrasonic -> Pin 12 & 13                                                *
 *  GPS -> Pin 32 & 34                                                       *
 *  HX711 -> Pin 16 & 4                                                      *
 *****************************************************************************/
const int pressPin = 35, valvePin = 19;

const String truckId = "662bf28c920ec610546933a4";

const float fullTankPingVal_cm = 4.00, emptyTankPingVal_cm = 17.00;

const char* ssid     = "MQ008";
const char* password = "Donsi008hot";

char serverAddress[] = "192.168.43.190";  // server address # check on list of connected device in hotspotting phone!!
int port = 1999;


WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);

#define TRIGGER_PIN  12  // Arduino pin tied to trigger pin on the ultrasonic sensor.
#define ECHO_PIN     13  // Arduino pin tied to echo pin on the ultrasonic sensor.
#define MAX_DISTANCE 200 // Maximum distance we want to ping for (in centimeters). Maximum sensor distance is rated at 400-500cm.

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); // NewPing setup of pins and maximum distance.


// RX and TX pin from context of controller!
//controller RX <--> GPS TX
// controller TX <--> GPS RX
static const int RXPin = 34, TXPin = 32;
static const uint32_t GPSBaud = 9600;

// The TinyGPSPlus object
TinyGPSPlus gps;

// hx711 object
HX711 scale;
uint8_t dataPin = 16;
uint8_t clockPin = 4;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

void setup() {
    pinMode(valvePin, INPUT);
    pinMode(15, OUTPUT);
    //set the resolution to 12 bits (0-4096)
    analogReadResolution(12);
  
    Serial.begin(9600);
    while(!Serial){delay(100);}

    scale.begin(dataPin, clockPin);
    // Obtained from HX711 calibration
    scale.set_offset(35644);
    scale.set_scale(9.298984);

    Serial.println();
    Serial.println("******************************************************");
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
      Serial.print(".");
      delay(500);
      digitalWrite(15, LOW);
      Serial.print(".");
      delay(500);
      digitalWrite(15, HIGH);
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    ss.begin(GPSBaud);
}

void loop(){

  //GPS
  while (ss.available() > 0)
    if(gps.encode(ss.read()))
      sendInfo();

  if((millis() > 5000) && (gps.charsProcessed() < 10)) {
      Serial.println(F("No GPS detected: check wiring."));
      sendInfoWithoutGps();
      // while(true);
    }
}

void sendInfo(){
  Serial.println("Sending with gps data...");
  Serial.println("\nWait 10 seconds\n\n");
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
  } else {
    digitalWrite(15, HIGH);
  }

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    digitalWrite(15, LOW);
    delay(500);
    digitalWrite(15, HIGH);
  }

  delay(5000);
  JsonDocument sensorDataObject;
  JsonDocument gpsData;
  
  if (gps.location.isValid())
  {
    gpsData["latitude"] = gps.location.lat();
    gpsData["longitude"] = gps.location.lng();
  }
  else
  {
    gpsData["latitude"] = 0.00;
    gpsData["longitude"] = 0.00;
  }

  sensorDataObject["gps"] = gpsData;

  // ULTRASONIC
  float distance_cm = sonar.ping_cm(); // Send ping, get distance in cm (0 = outside set distance range)
  float level = 100 - (100 * (distance_cm - fullTankPingVal_cm) / (emptyTankPingVal_cm - fullTankPingVal_cm));
  sensorDataObject["level"] = level;

  // HX711
  float weight_g = scale.get_units(20)/10;
  if (weight_g < 0.0) {
    weight_g = 15.34; 
  }
  sensorDataObject["weight"] = weight_g;

  // Pressure
  int pressure  = analogReadMilliVolts(pressPin);
  sensorDataObject["pressure"] = pressure;

  // Valve
  bool valve = digitalRead(valvePin);
  sensorDataObject["valve"] = valve;
  
   // convert into a JSON string
  String sensorDataObjectString, sensorDataObjectPrettyString;
  serializeJson(sensorDataObject, sensorDataObjectString);
  serializeJsonPretty(sensorDataObject, sensorDataObjectPrettyString);

  // send JSON data to server
  String endpoint = "/truck/update/tank/" + truckId;
  client.beginRequest();
  client.post(endpoint);
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Content-Length", sensorDataObjectString.length());
  client.sendHeader("Connection", "close");
  client.beginBody();
  client.print(sensorDataObjectString);
  int statusCodePost = client.responseStatusCode();
  String responsePost = client.responseBody();
  client.endRequest();

  Serial.print("\nPost Response Status Code: ");
  Serial.println(statusCodePost);
  Serial.print("\nPost Response: ");
  Serial.println(responsePost);

  //Print stringified data objects
  Serial.println("\nPretty JSON Object:");
  Serial.println(sensorDataObjectPrettyString);
}

void sendInfoWithoutGps(){
  Serial.println("Sending without gps data...");
  Serial.println("\nWait 25 seconds\n\n");

  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
  } else {
    digitalWrite(15, HIGH);
  }

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    digitalWrite(15, LOW);
    delay(500);
    digitalWrite(15, HIGH);
  }

  delay(20000);
  JsonDocument sensorDataObject;

  // ULTRASONIC
  float distance_cm = sonar.ping_cm(); // Send ping, get distance in cm (0 = outside set distance range)
  float level = 100 - (100 * (distance_cm - fullTankPingVal_cm) / (emptyTankPingVal_cm - fullTankPingVal_cm));
  sensorDataObject["level"] = level;

  // HX711
  float weight_g = scale.get_units(20)/10;
  sensorDataObject["weight"] = weight_g;

  //Pressure
  int pressure  = analogReadMilliVolts(pressPin);
  sensorDataObject["pressure"] = pressure;

  // Valve
  bool valve = digitalRead(valvePin);
  sensorDataObject["valve"] = valve;
  
   // convert into a JSON string
  String sensorDataObjectString, sensorDataObjectPrettyString;
  serializeJson(sensorDataObject, sensorDataObjectString);
  serializeJsonPretty(sensorDataObject, sensorDataObjectPrettyString);

  // send JSON data to server
  String endpoint = "/truck/update/tank/" + truckId;
  // String endpoint = "/";
  client.beginRequest();
  client.post(endpoint);
  // client.get(endpoint);
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Content-Length", sensorDataObjectString.length());
  client.sendHeader("Connection", "close");
  client.beginBody();
  client.print(sensorDataObjectString);
  int statusCodePost = client.responseStatusCode();
  String responsePost = client.responseBody();
  client.endRequest();

  Serial.print("\nPost Response Status Code: ");
  Serial.println(statusCodePost);
  Serial.print("\nPost Response: ");
  Serial.println(responsePost);

  //Print stringified data objects
  Serial.println("\nPretty JSON Object:");
  Serial.println(sensorDataObjectPrettyString);
}
