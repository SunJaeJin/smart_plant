import sys
sys.path.append('/home/SJJ/.local/lib/python3.9/dist-packages')
sys.path.append('/home/SJJ/.local/lib/python3.9/site-packages')
import configparser
import Adafruit_DHT
import spidev
import time
from api_test import *
from log_module import *
from setinterval import *
from control_module import *
global watering
global temp_low
global temp_high
global humi_low
global humi_high
global light
global sensortimeplag
global Autoplag 
global FanSetting
global HumiSetting
global LedSetting
global BrightSetting
global led_start_time
global led_stop_time
global led_plag

led_plag = False
led_start_time = "NONE"
led_stop_time = "NONE"
Autoplag = "ON"
FanSetting="OFF"
HumiSetting="OFF"
LedSetting="OFF"
BrightSetting="0"
sensortimeplag=0
dht_type = 22 # DHT 타입
dht_pin = 23 # DHT핀 번호

delay = 1 
# Open Spi Bus
# SPI 버스 0과 디바이스 0을 열고
# 최대 전송 속도를 1MHz로 설정
spi = spidev.SpiDev()
spi.open(0,0) # open(bus, device)
spi.max_speed_hz = 1000000 # set transfer speed

# To read SPI data from MCP3008 chip
# Channel must be 0~7 integer
def readChannel(channel): 
  val = spi.xfer2([1, (8+channel)<<4, 0])
  data = ((val[1]&3) << 8) + val[2]
  return data

# 0~1023 value가 들어옴. 1023이 수분함량 min값
def convertPercent_Soil(data):
  return 100.0-round(((data*100)/float(1023)),1)

def convertPercent_Water(data):
  return round(((data*100)/float(655)),1)

def Spi():
    val = readChannel(0)
    val2 = readChannel(1)
    if (val != 0) : # filtering for meaningless num
      print(val, "/", convertPercent_Soil(val),"%")
     # filtering for meaningless num
    print(val2, "/", convertPercent_Water(val2),"%")
    return val, val2
  
def DHT():
    humidity, temperature = Adafruit_DHT.read_retry(dht_type, dht_pin) # DHT에서 값을 가져옴
    if humidity is not None and temperature is not None: # 값이 없을 시 console에 출력하지 않음
        print('Temp={0:0.1f} C Humidity={1:0.1f}%'.format(temperature, humidity))
    return temperature, humidity
    #PostDHT(temperature, humidity)

def Sensor():
    soil, water = Spi()
    temp, humi = DHT()
    return temp, humi, soil, water

def sleep_mode():
    global led_plag
    global led_start_time
    global led_stop_time
    print(led_start_time)
    hour = str(datetime.now().hour)
    mit = str(datetime.now().minute)
    now = str(hour)+":"+mit
    print(led_stop_time)
    print(now)
    print(led_start_time)
    if((led_stop_time=="NONE")or(led_start_time=="NONE")):
        return
    elif((led_stop_time=="null")or(led_start_time=="null")):
        return
    elif(led_stop_time<now<led_start_time):
        print(1)
        #if(led_plag==False):
        led_module(light)
        #PostActData("LedOn:Auto", "Led")
        print("ledstart")
    else:
        #if(led_plag==True):
        led_off_module()
        #PostActData("LedOff:Auto", "Led")
        print("ledStop")
def main():
    global watering
    global temp_low
    global temp_high
    global humi_low
    global humi_high
    global light
    global sensortimeplag
    global Autoplag
    global led_start_time
    global led_stop_time
    resDHT = False
    resSoil = False
    resWater = False
    temp, humi, soil, water = Sensor()
    if(sensortimeplag==0):
       if((temp == 0)or(humi==0)):
            temp, humi = DHT()
       resDHT = PostDHT(temp, humi)
       if((convertPercent_Soil(soil)==0)or(convertPercent_Water(water))):
           soil, water = Spi()
       resSoil = PostData(convertPercent_Soil(soil), "soil")
       if(int(convertPercent_Water(water))>100):
           resWater = PostData(100,"water")
       else:
           resWater = PostData(convertPercent_Water(water),"water")
    sensortimeplag = sensortimeplag+1
    if(sensortimeplag==12): #1hour 720
        sensortimeplag = 0
    if((resDHT==True)or(resSoil==True)or(resWater==True)):
        sensortimeplag = 0
    if(Autoplag=="OFF"):
        return
#    if(Autoplag == "ON"):
 #       led_module(light)
    if(temp>temp_high):
        temp_high_module()
    elif(temp<temp_low):
        temp_low_module()
    elif((temp<temp_high)and(temp>temp_low)):
        temp_normal_module()
        
    if(humi>humi_high):
        humi_high_module()
    elif(humi<humi_low):
        humi_low_module()
    elif((humi<humi_high)and(humi>humi_low)):
        humi_normal_module()
    
    if(convertPercent_Water(water)<25):
        print('water lack')
        
    if(watering=="Bi-weely"):
        per = 50
    elif(watering=="Daily"):
        per = 60
    else:
        per= 40
    print("per:" ,per)
    if(int(convertPercent_Soil(soil))<per):
       soil_low_module(watering)
    sleep_mode()
        
        
    
def SMARTPOT_start():
    global Autoplag
    global light
    global led_plag
    log_debug("SMART POT START")
    plantdata_update()
    ModuleSetting_start()
    if(Autoplag == "ON"):
        print('led_module')
        led_module(light)
        log_debug("LedOn: Auto")
        PostActData("LedOn: Auto", "Led")
        led_plag = True
    start_interval(main, 5)
    
def SMARTPOT_stop():
    all_off_module()
    log_debug("SMART POT STOP")
    stop_interval()

def SMARTPOT_restart():
    global sensortimeplag
    sensortimeplag = 0
    log_debug("SMART POT RESTART")
    print("restart")
    SMARTPOT_stop()
    time.sleep(3)
    SMARTPOT_start()
    
def Module_Setting(setting):
    global Autoplag
    global FanSetting
    global HumiSetting
    global LedSetting
    global BrightSetting
    if(setting=="AutoOn"):
        Autoplag = "ON"
        if(Autoplag == "ON"):
            print('led_module')
            led_module(light)
            log_debug("LedOn: Auto")
            PostActData("LedOn: Auto", "Led")
            led_plag = True
        FanSetting="OFF"
        HumiSetting="OFF"
        LedSetting="OFF"
        print("AutoOn!!")
    elif(setting=="AutoOff"):
        Autoplag = "OFF"
        all_off_module()
        print("AutoOff!!")
    elif(setting=="FanOn"):
        FanSetting = "ON"
        if(Autoplag == "ON"):
            Autoplag = "OFF"
            all_off_module()
        fan_on_module()
        print("FanOn!!")
    elif(setting=="FanOff"):
        FanSetting = "OFF"
        if(Autoplag == "ON"):
            Autoplag = "OFF"
            all_off_module()
        fan_off_module()
        print("FanOff!!")
    elif(setting=="HumiOn"):
        HumiSetting = "ON"
        if(Autoplag == "ON"):
            Autoplag = "OFF"
            all_off_module()
        humi_on_module()
        print("HumiOn!!")
    elif(setting=="HumiOff"):
        HumiSetting = "OFF"
        if(Autoplag == "ON"):
            Autoplag = "OFF"
            all_off_module()
        humi_off_module()
        print("HumiOff!!")
    elif(setting=="LedOn"):
        LedSetting = "ON"
        if(Autoplag == "ON"):
            Autoplag = "OFF"
            all_off_module()
        led_on_module()
        print("LedOn!!")
    elif(setting=="LedOff"):
        LedSetting = "OFF"
        if(Autoplag == "ON"):
            Autoplag = "OFF"
            all_off_module()
        led_off_module()
        print("LedOff!!")
        Autoplag = "OFF"
    elif(setting=="Pump"):
        if(Autoplag == "ON"):
            Autoplag = "OFF"
            all_off_module()
        pump_module()
        print("Pump!!")
        return
    else:
        if(Autoplag == "ON"):
            Autoplag = "OFF"
            all_off_module()
        BrightSetting = setting
        print("Ledbright")
        led_bright_module(setting)
    ModuleSetting_write()

def plantdata_update():
    global watering
    global temp_low
    global temp_high
    global humi_low
    global humi_high
    global light
    global led_start_time
    global led_stop_time
    configr = configparser.ConfigParser()
    configr.read('/home/SJJ/python/plantdata.ini') #파일 존재하는지 확
    if not 'PLANT_DATA' in configr:
        print("config['PLANT_DATA'] not exist")
    if 'WATERING' in configr['PLANT_DATA']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['PLANT_DATA']['WATERING'] : " + configr['PLANT_DATA']['WATERING'])
        watering = configr['PLANT_DATA']['WATERING']
    if 'TEMP_LOW' in configr['PLANT_DATA']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['PLANT_DATA']['TEMP_LOW'] : " + configr['PLANT_DATA']['TEMP_LOW'])
        temp_low = float(configr['PLANT_DATA']['TEMP_LOW'])
    if 'TEMP_HIGH' in configr['PLANT_DATA']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['PLANT_DATA']['TEMP_HIGH'] : " + configr['PLANT_DATA']['TEMP_HIGH'])
        temp_high = float(configr['PLANT_DATA']['TEMP_HIGH'])
    if 'HUMI_LOW' in configr['PLANT_DATA']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['PLANT_DATA']['HUMI_LOW'] : " + configr['PLANT_DATA']['HUMI_LOW'])
        humi_low = float(configr['PLANT_DATA']['HUMI_LOW'])
    if 'HUMI_HIGH' in configr['PLANT_DATA']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['PLANT_DATA']['HUMI_HIGH'] : " + configr['PLANT_DATA']['HUMI_HIGH'])
        humi_high = float(configr['PLANT_DATA']['HUMI_HIGH'])
    if 'LIGHT' in configr['PLANT_DATA']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['PLANT_DATA']['LIGHT'] : " + configr['PLANT_DATA']['LIGHT'])
        light = configr['PLANT_DATA']['LIGHT']
    if 'LEDSTARTTIME' in configr['PLANT_DATA']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['PLANT_DATA']['LEDSTOPTIME'] : " + configr['PLANT_DATA']['LEDSTARTTIME'])
        led_start_time = configr['PLANT_DATA']['LEDSTARTTIME']
    if 'LEDSTOPTIME' in configr['PLANT_DATA']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['PLANT_DATA']['LEDSTARTTIME'] : " + configr['PLANT_DATA']['LEDSTOPTIME'])
        led_stop_time = configr['PLANT_DATA']['LEDSTOPTIME']

def ModuleSetting_start():
    ModuleSetting_update()
    global Autoplag
    global FanSetting
    global HumiSetting
    global LedSetting
    global BrightSetting
    
    if(Autoplag=="ON"):
        return
    
    if(FanSetting=="ON"):
        fan_on_module()
    else:
        fan_off_module()
    if(HumiSetting=="ON"):
        humi_on_module()
    else:
        humi_off_module()
    if(LedSetting=="ON"):
        led_on_module()
        led_bright_module(BrightSetting)
    else:
        led_off_module()
    #led_bright_module(BrightSetting)
def ModuleSetting_write():
    global Autoplag
    global FanSetting
    global HumiSetting
    global LedSetting
    global BrightSetting
    configw = configparser.ConfigParser()
    configw['MODULESETTING'] = {}
    configw['MODULESETTING']['AUTO'] = Autoplag
    configw['MODULESETTING']['FAN'] = FanSetting
    configw['MODULESETTING']['HUMI'] = HumiSetting
    configw['MODULESETTING']['LED'] = LedSetting
    configw['MODULESETTING']['BRIGHT'] = BrightSetting
    with open('/home/SJJ/python/module_setting.ini', 'w') as configfile:
        configw.write(configfile)

def ModuleSetting_update():
    global Autoplag
    global FanSetting
    global HumiSetting
    global LedSetting
    global BrightSetting
    configr = configparser.ConfigParser()
    configr.read('/home/SJJ/python/module_setting.ini') #파일 존재하는지 확
    if not 'MODULESETTING' in configr:
        print("config['MODULESETTING'] not exist")
        return
    if 'AUTO' in configr['MODULESETTING']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['MODULESETTING']['AUTO'] : " + configr['MODULESETTING']['AUTO'])
        Autoplag = configr['MODULESETTING']['AUTO']
    if 'FAN' in configr['MODULESETTING']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['MODULESETTING']['FAN'] : " + configr['MODULESETTING']['FAN'])
        FanSetting = configr['MODULESETTING']['FAN']
    if 'HUMI' in configr['MODULESETTING']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['MODULESETTING']['HUMI'] : " + configr['MODULESETTING']['HUMI'])
        HumiSetting = configr['MODULESETTING']['HUMI']
    if 'LED' in configr['MODULESETTING']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['MODULESETTING']['LED'] : " + configr['MODULESETTING']['LED'])
        LedSetting = configr['MODULESETTING']['LED']
    if 'BRIGHT' in configr['MODULESETTING']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['MODULESETTING']['BRIGHT'] : " + configr['MODULESETTING']['BRIGHT'])
        BrightSetting = configr['MODULESETTING']['BRIGHT']



#led_off_module()

#SMARTPOT_start()
#except KeyboardInterrupt:
#  spi.close()
#GPIO.cleanup()