from pybleno import Characteristic
import array
import struct
import sys
import traceback
import configparser
global Device_Info
from SMARTPOT import *
from log_module import *

    
class ApproachModuleCharacteristic(Characteristic):
    def __init__(self, uuid):
        Characteristic.__init__(self, {
            'uuid': uuid,
            'properties': ['read', 'write', 'notify'],
            'value': None
          })
          
        self._value = array.array('B', [0] * 0)
        self._updateValueCallback = None
          
    def onReadRequest(self, offset, callback):
        print('INIT')
        temp = "200"
        temp1 = temp.encode('utf-8')
        log_debug("SMART POT INIT")
        configw = configparser.ConfigParser()
        configw['DEFALT'] = {}
        with open('/home/SJJ/python/user_info.ini', 'w') as configfile:
            configw.write(configfile)
        with open('/home/SJJ/python/module_setting.ini', 'w') as configfile1:
            configw.write(configfile1)
        with open('/home/SJJ/python/plantdata.ini', 'w') as configfile2:
            configw.write(configfile2)
        SMARTPOT_stop()
        #writeUInt8(data, self.pizza.crust, 0)
        callback(Characteristic.RESULT_SUCCESS, temp1)

    def onWriteRequest(self, data, offset, withoutResponse, callback):
        #self._value = data
        print('Modulewrite')
        temp = data.decode()
        print(data)
        print(temp)
        Module_Setting(temp)
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