//
//    FILE: HX_grocery_scale.ino
//  AUTHOR: Rob Tillaart
// PURPOSE: HX711 demo
//     URL: https://github.com/RobTillaart/HX711


#include "HX711.h"

HX711 scale;

uint8_t dataPin = 16;
uint8_t clockPin = 4;


void setup()
{
  Serial.begin(115200);
  Serial.println(__FILE__);
  Serial.print("LIBRARY VERSION: ");
  Serial.println(HX711_LIB_VERSION);
  Serial.println();

  scale.begin(dataPin, clockPin);

  scale.set_offset(35644);
  scale.set_scale(9.298984);
}


void loop()
{
  Serial.print("UNITS: ");
  Serial.print(scale.get_units(20)/10);
  Serial.println();
  delay(1000);
}


//  -- END OF FILE --
