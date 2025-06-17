import threading
import time
import configparser
global Device_Info
global invertval_plag

invertval_plag = False

def set_interval(func, sec):
    def func_wrapper():
        if(invertval_plag == False):return
        set_interval(func, sec)
        func()
    if(invertval_plag == False):return
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t

def start_interval(func, sec):
    global invertval_plag
    invertval_plag = True
    set_interval(func, sec)

def stop_interval():
    global invertval_plag
    invertval_plag = False

def data_update():
    global Device_Info
    configr = configparser.ConfigParser()
    configr.read('/home/SJJ/python/test/config.ini') #파일 존재하는지 확
    if not 'PLANT' in configr:
        print("config['INFORMATION'] not exist")
        Device_Info = "SMARTPOT"
    if 'NAME' in configr['PLANT']: # 섹션 아래 값이 존재하는지 체크    
        print("configr['INFORMATION']['INFO'] : " + configr['PLANT']['NAME'])
        Device_Info = configr['PLANT']['NAME']
        