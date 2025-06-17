from pybleno import Characteristic
import array
import struct
import sys
import traceback
import configparser
global Device_Info
from log_module import *

configr = configparser.ConfigParser()
configr.read('/home/SJJ/python/config.ini') #파일 존재하는지 확
if not 'INFORMATION' in configr:
    print("config['INFORMATION'] not exist")
    Device_Info = "SMARTPOT"
if 'INFO' in configr['INFORMATION']: # 섹션 아래 값이 존재하는지 체크    
    print("configr['INFORMATION']['INFO'] : " + configr['INFORMATION']['INFO'])
    Device_Info = configr['INFORMATION']['INFO']

def DeviceName_Update(name):
    configr = configparser.ConfigParser()
    configr.read('/home/SJJ/python/config.ini') #파일 존재하는지 확
    if not 'INFORMATION' in configr:
        print("config['INFORMATION'] not exist")
        Device_Info = "SMARTPOT"
    if 'INFO' in configr['INFORMATION']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['INFORMATION']['INFO'] : " + configr['INFORMATION']['INFO'])
        Device_Info = configr['INFORMATION']['INFO']
    configw = configparser.ConfigParser()
    configw['INFORMATION'] = {}
    configw['INFORMATION']['INFO'] = Device_Info
    configw['INFORMATION']['NAME'] = name
    with open('/home/SJJ/python/config.ini', 'w') as configfile:
        configw.write(configfile)
        

class ApproachCharacteristic(Characteristic):
    def __init__(self, uuid):
        Characteristic.__init__(self, {
            'uuid': uuid,
            'properties': ['read', 'write', 'notify'],
            'value': None
          })
          
        self._value = array.array('B', [0] * 0)
        self._updateValueCallback = None
          
    def onReadRequest(self, offset, callback):
        print('read')
        log_debug("SMART POT CONNETED")
        global Device_Info
        data1 = Device_Info
        temp = data1.encode('utf-8')
        #writeUInt8(data, self.pizza.crust, 0)
        callback(Characteristic.RESULT_SUCCESS, temp)

    def onWriteRequest(self, data, offset, withoutResponse, callback):
        #self._value = data
        print('write')
        temp = data.decode()
        print(data)
        print(temp)
        DeviceName_Update(temp)
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