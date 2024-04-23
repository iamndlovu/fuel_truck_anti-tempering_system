#include <Arduino.h>
#include <ArduinoHttpClient.h>
#include <WiFi.h>
#include <NewPing.h>
#include <TinyGPSPlus.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
/*****************************************************************************
 *  Pressure -> Pin 33                                                       *
 *  Valve -> Pin 23                                                          *
 *  Ultrasonic -> Pin 12 & 13                                                *
 *  GPS -> Pin 2 & 4                                                         *
 *****************************************************************************/
const int pressPin = 33, valvePin = 19;

const String truckId = "661fe402119ba44ad3c38185";

const float fullTankPingVal_cm = 2.30, emptyTankPingVal_cm = 30.00;

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
static const int RXPin = 4, TXPin = 2;
static const uint32_t GPSBaud = 9600;

// The TinyGPSPlus object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

void setup() {
    pinMode(valvePin, INPUT);
    //set the resolution to 12 bits (0-4096)
    analogReadResolution(12);
  
    Serial.begin(9600);
    while(!Serial){delay(100);}

    Serial.println();
    Serial.println("******************************************************");
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
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
      while(true);
    }
}

void sendInfo(){
  Serial.println("Sending with gps data...");
  Serial.println("\nWait 10 seconds\n\n");
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
  delay(20000);
  JsonDocument sensorDataObject;

  // ULTRASONIC
  float distance_cm = sonar.ping_cm(); // Send ping, get distance in cm (0 = outside set distance range)
  float level = 100 - (100 * (distance_cm - fullTankPingVal_cm) / (emptyTankPingVal_cm - fullTankPingVal_cm));
  sensorDataObject["level"] = level;

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
