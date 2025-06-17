import RPi.GPIO as GPIO
import time
from datetime import datetime, timedelta
import board
import neopixel
from log_module import *
from api_test import *
global temp_fan_plag
global humi_fan_plag
global watering_plag
global humi_fan_plag
global watering_ten_minutes_after
watering_plag = True
temp_fan_plag = False
humi_fan_plag = False

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.OUT) #fan1
GPIO.setup(17, GPIO.OUT) #fan2
GPIO.setup(26, GPIO.OUT) #humi
GPIO.setup(27, GPIO.OUT) #pump
#19 16 20 26
pixel_pin = board.D21

# The number of NeoPixels
num_pixels = 12

# The order of the pixel colors - RGB or GRB. Some NeoPixels have red and green reversed!
# For RGBW NeoPixels, simply change the ORDER to RGBW or GRBW.
ORDER = neopixel.GRB

pixels = neopixel.NeoPixel(
    pixel_pin, num_pixels, brightness=1.0, auto_write=False, pixel_order=ORDER
)
print("fan_setup")
log_debug("module_setup")

def temp_high_module():
    print('temphigh')
    global temp_fan_plag
    global humi_fan_plag
    temp_fan_plag = True
    if(temp_fan_plag==True or humi_fan_plag==True):
        if(GPIO.input(17)==False):
            PostActData("FanOn:temp_high", "Fan")
            log_debug("FanOn:temp_high")
            GPIO.output(18,True)
            GPIO.output(17,True)
        
def temp_low_module():
    global temp_fan_plag
    global humi_fan_plag
    temp_fan_plag = False
    if(temp_fan_plag==True or humi_fan_plag==True):
        return
    else:
        if(GPIO.input(17)==True):
            PostActData("FanOff:temp_low", "Fan")
            log_debug("FanOff:temp_low")
        GPIO.output(18,False)
        GPIO.output(17,False)

def temp_normal_module():
    global temp_fan_plag
    global humi_fan_plag
    temp_fan_plag = False
    if(temp_fan_plag==True or humi_fan_plag==True):
        return
    else:
        if(GPIO.input(17)==True):
            PostActData("FanOff:temp_normal", "Fan")
            log_debug("FanOff:temp_normal")
        GPIO.output(18,False)
        GPIO.output(17,False)
        
def humi_high_module():
    global temp_fan_plag
    global humi_fan_plag
    humi_fan_plag = True
    if(temp_fan_plag==True or humi_fan_plag==True):
        if(GPIO.input(17)==False):
            PostActData("FanOn:humi_high", "Fan")
            log_debug("FanOn:humi_high")
            GPIO.output(18,True)
            GPIO.output(17,True)
    if(GPIO.input(26)==True):
        PostActData("HumiOff:humi_high", "Humidifier")
        log_debug("HumiOff:humi_high")
        GPIO.output(26,False)
        
def humi_low_module():
    global temp_fan_plag
    global humi_fan_plag
    humi_fan_plag = False
    if(GPIO.input(26)==False):
        PostActData("HumiOn:humi_low", "Humidifier")
        log_debug("HumiOn:humi_low")
        GPIO.output(26,True)
    if(temp_fan_plag==True or humi_fan_plag==True):
        return
    else:
        if(GPIO.input(17)==True):
            PostActData("FanOff:humi_low", "Fan")
            log_debug("FanOff:humi_low")
        GPIO.output(18,False)
        GPIO.output(17,False)
    #humi_plus(false)

def humi_normal_module():
    global temp_fan_plag
    global humi_fan_plag
    humi_fan_plag = False
    if(GPIO.input(26)==True):
        PostActData("HumiOn:humi_normal", "Humidifier")
        log_debug("HumiOn:humi_normal")
        GPIO.output(26,False)
    if(temp_fan_plag==True or humi_fan_plag==True): 
        return
    else:
        if(GPIO.input(17)==True):
            PostActData("FanOff:humi_normal", "Fan")
            log_debug("FanOff:humi_normal")
        GPIO.output(18,False)
        GPIO.output(17,False)
    #humi_plus(false)
    
def soil_low_module(watering):
    global watering_plag
    global watering_ten_minutes_after
    if(watering_plag == True):
        watering_plag = False
        watering_ten_minutes_after = datetime.now()+ timedelta(minutes=1)
        if(watering=="Bi-weekly"):
            GPIO.output(27,True)
            time.sleep(8)
            GPIO.output(27,False)
            PostActData("PumpOn:Aato", "Pump")
        elif(watering=="Weekly"):
            GPIO.output(27,True)
            time.sleep(12)
            GPIO.output(27,False)
            PostActData("PumpOn:Aato", "Pump")
            print("bi")
        elif(watering=="Daily"):
            GPIO.output(27,True)
            time.sleep(4)
            GPIO.output(27,False)
            PostActData("PumpOn:Aato", "Pump")
    elif(datetime.now() > watering_ten_minutes_after):
        watering_plag = True
        soil_low_module(watering)

def all_off_module():
    GPIO.output(18,False)
    GPIO.output(17,False)
    GPIO.output(26,False)
    GPIO.output(27,False)
    pixels.fill((0, 0, 0))
    # Uncomment this line if you have RGBW/GRBW NeoPixels
    # pixels.fill((255, 0, 0, 0))
    pixels.show()
    
def fan_on_module():
    log_debug("FanOn:manual")
    #PostActData("FanOn:manual", "Fan")
    GPIO.output(18,True)
    GPIO.output(17,True)

def fan_off_module():
    log_debug("FanOff:manual")
    #PostActData("FanOff:manual", "Fan")
    GPIO.output(18,False)
    GPIO.output(17,False)

def humi_on_module():
    log_debug("HumiOn:manual")
    #PostActData("HumiOn:manual", "Humidifier")
    GPIO.output(26,True)


def humi_off_module():
    log_debug("HumiOff:manual")
    #PostActData("HumiOff:manual", "Humidifier")
    GPIO.output(26,False)

def led_module(light):
    if(light=="Low"):
        pixels.fill((150, 150, 150))
    elif(light=="High"):
        pixels.fill((255, 255, 255))
    else:
        pixels.fill((200, 200, 200))
    pixels.show()


def led_on_module():
    log_debug("LedOn:manual")
    #PostActData("LedOn:manual", "Led")
    pixels.fill((255, 255, 255))
    # Uncomment this line if you have RGBW/GRBW NeoPixels
    # pixels.fill((255, 0, 0, 0))
    pixels.show()

def led_clean_module():
    pixels.deinit()

def led_off_module():
    log_debug("LedOff:manual")
    #PostActData("LedOff:manual", "Led")
    #pixels.deinit()
    pixels.fill((0, 0, 0))
    # Uncomment this line if you have RGBW/GRBW NeoPixels
    # pixels.fill((255, 0, 0, 0))
    pixels.show()
    

def pump_module():
    log_debug("PumpOn:manual")
    PostActData("PumpOn:manual", "Pump")
    GPIO.output(27,True)
    time.sleep(1)
    GPIO.output(27,False)
    
def led_bright_module(bright):
    log_debug("BrightChange:manual")
    brightness=int(bright)
    pixels.fill((brightness, brightness, brightness))
    # Uncomment this line if you have RGBW/GRBW NeoPixels
    # pixels.fill((255, 0, 0, 0))
    pixels.show()

#GPIO.cleanup()
