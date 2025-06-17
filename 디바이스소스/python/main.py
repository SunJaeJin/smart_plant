import time
time.sleep(10)
from pybleno import *
import sys
import signal
from EchoCharacteristic import *
from AICharacteristic import *
from ModuleCharacteristic import *
from AutoCharacteristic import *
from log_module import *
global Device_Name

print('bleno - echo');
log_debug("SMART POT START")
configr = configparser.ConfigParser()
configr.read('/home/SJJ/python/config.ini') #파일 존재하는지 확
if not 'INFORMATION' in configr:
    print("config['INFORMATION'] not exist")
    Device_Name = "SMARTPOT"
if 'INFO' in configr['INFORMATION']: # 섹션 아래 값이 존재하는지 체크    
    print("configr['INFORMATION']['NAME'] : " + configr['INFORMATION']['NAME'])
    Device_Name = configr['INFORMATION']['NAME']
        
ecochar0 = ApproachCharacteristic('ec0F')
ecochar1 = ApproachAICharacteristic('ec1F')
ecochar2 = ApproachModuleCharacteristic('ec2F')
ecochar3 = ApproachAutoCharacteristic('ec3F')
bleno = Bleno()

def onStateChange(state):
   global Device_Name
   print('on -> stateChange: ' + state);

   if (state == 'poweredOn'):
     bleno.startAdvertising(Device_Name, ['ec00'])
   else:
     bleno.stopAdvertising();

bleno.on('stateChange', onStateChange)
    
def onAdvertisingStart(error):
    print('on -> advertisingStart: ' + ('error ' + error if error else 'success'));

    if not error:
        bleno.setServices([
            BlenoPrimaryService({
                'uuid': 'ec00',
                'characteristics': [ecochar0, ecochar1, ecochar2, ecochar3],
            })
        ])
bleno.on('advertisingStart', onAdvertisingStart)

bleno.start()
configr2 = configparser.ConfigParser()
configr2.read('/home/SJJ/python/plantdata.ini') #파일 존재하는지 확
if not 'PLANT_DATA' in configr2:
    print("config['PLANT_DATA'] not exist")
else:
    SMARTPOT_start()
        
print ('Hit <ENTER> to disconnect')
if (sys.version_info > (3, 0)):
    input()
else:
    raw_input()

SMARTPOT_stop()
led_clean_module()
humi_off_module()

print ('terminated.')

sys.exit(1)
log_debug("SMART POT END")
    
#bleno.stopAdvertising()

#bleno.disconnect()

