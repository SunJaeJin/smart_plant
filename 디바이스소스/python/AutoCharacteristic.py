from pybleno import Characteristic
import array
import struct
import sys
import traceback
import configparser
global Device_Info
from SMARTPOT import *
from log_module import *
from get_plant import *

    
class ApproachAutoCharacteristic(Characteristic):
    def __init__(self, uuid):
        Characteristic.__init__(self, {
            'uuid': uuid,
            'properties': ['read', 'write', 'notify'],
            'value': None
          })
          
        self._value = array.array('B', [0] * 0)
        self._updateValueCallback = None
          
    def onReadRequest(self, offset, callback):
        temp = data.encode('utf-8')
        #writeUInt8(data, self.pizza.crust, 0)
        callback(Characteristic.RESULT_SUCCESS, temp)

    def onWriteRequest(self, data, offset, withoutResponse, callback):
        #self._value = data
        print('Autowrite')
        temp = data.decode()
        print(data)
        print(temp)
        Set_Auto(temp)
        plantdata_update()
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