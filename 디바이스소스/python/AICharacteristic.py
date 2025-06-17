from pybleno import Characteristic
import array
import struct
import sys
import traceback
import configparser
from api_test import *
from log_module import *
from get_plant import *
from SMARTPOT import *
#from dht.py import *
global Device_Info

def setname(plantname, UserId):
    configw = configparser.ConfigParser()
    configw['PLANT'] = {}
    configw['PLANT']['NAME'] = plantname
    configw['USER'] = {}
    configw['USER']['ID'] = UserId
    with open('/home/SJJ/python/user_info.ini', 'w') as configfile:
        configw.write(configfile)
class ApproachAICharacteristic(Characteristic):
    def __init__(self, uuid):
        Characteristic.__init__(self, {
            'uuid': uuid,
            'properties': ['read', 'write', 'notify'],
            'value': None
          })
          
        self._value = array.array('B', [0] * 0)
        self._updateValueCallback = None
          
    def onReadRequest(self, offset, callback):
        log_debug("AIrequset")
        plag = PostAI('D8:3A:DD:1E:AB:24')
        #    data = "200"
        #else:
        data = "500"
        temp = data.encode('utf-8')
        print('AIread')
        #writeUInt8(data, self.pizza.crust, 0)
        callback(Characteristic.RESULT_SUCCESS, temp)

    def onWriteRequest(self, data, offset, withoutResponse, callback):
        #self._value = data
        #temp = data.decode()
        #DHT()
        print('AIwrite')
        log_debug("Plant_Wirte")
        #DHT()
        # 섹션 아래 실제 값을 생성한다
        print(data.decode())
        items = str(data.decode()).split(",")
        plantname = items[0]
        UserId = items[1]
        setname(plantname, UserId)
        Get_Plant(plantname)
        #smartpot no starting
        SMARTPOT_restart()
        if self._updateValueCallback:
            print('EchoCharacteristic - onWriteRequest: notifying');
            
            self._updateValueCallback(self._value)
        
        callback(Characteristic.RESULT_SUCCESS)
        
    def onSubscribe(self, maxValueSize, updateValueCallback):
        print('EchoCharacteristic - onSubscribe')
        
        self._updateValueCallback = updateValueCallback

    def onUnsubscribe(self):
        print('EchoCharacteristic - onUnsubscribe');
        
        self._updateValueCallback = None