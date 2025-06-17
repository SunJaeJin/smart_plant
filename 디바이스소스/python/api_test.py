import requests
import json
import sys
sys.path.append('/home/SJJ/.local/lib/python3.9/site-packages')
from requests_toolbelt import MultipartEncoder
#from requests_toolbelt.multipart.encoder import MultipartEncoder
import mimetypes
import random
import string
from picamera import PiCamera
import time
import configparser
from log_module import *
url = "http://ceprj.gachon.ac.kr:60007/"
act_url = "http://ceprj.gachon.ac.kr:60007/api/logs/actuator-log"
global user_id
global user_id_plag
user_id_plag = 0

def UserId_Update():
    global user_id
    configr = configparser.ConfigParser()
    configr.read('/home/SJJ/python/user_info.ini') #파일 존재하는지 확
    if not 'USER' in configr:
            print("config['USER'] not exist")
    else:
        user_id = configr['USER']['ID']

def CapturePlant():
    camera = PiCamera()
    #camera.resolution = (2592, 1944) # 최대 해상도 2592 x 1944
    camera.resolution = (1024, 768) # 해상도 1024 x 768
    camera.capture('plant.jpg') # 찍은 사진을 example.jpg로 저장
    camera.close()
#fields = {
#    "mac": "D8:3A:DD:1E:AB:24",
#    "photo": ("plant.jpg", open("plant.jpg","rb").read(), "image/jpg")
#}
#body = MultipartEncoder(fields)
#header = {'Content-type': body.content_type}
#response = requests.post(url+"api/devices/photo", headers=header, data = body)
#print(response)
# URL
# 127.0.0.1은 localhost로 대체 가능
#url = "http://ceprj.gachon.ac.kr:60007/"
#url = "http://ceprj.gachon.ac.kr:60007/api/logs/sensor-logs"

# headers
headers1 = {"Content-Type": "application/json;"}
# data

    
    #print(type(temp))
    #print(temp)
    #dataset = json.dumps(temp)
    #print(type(dataset))

# 딕셔너리를 JSON으로 변환
def PostActData(value, A_type):
    global user_id
    global user_id_plag
    if(user_id_plag == 0):
        UserId_Update()
        user_id_plag = 1
    data1 = {
    'user_ID': user_id,
    'actuator_type':A_type,
    'action':value,
    }
    #print(type(temp))
    print(data1)
    response = requests.post(act_url, json=data1)
    if(response.status_code==200):
        print('성공')
        log_debug("Post_temp")
    print("response: ", response)
    print("response.text: ", response.text)
    
def PostData(value, S_type):
    global user_id
    global user_id_plag
    redata = False
    if(user_id_plag == 0):
        UserId_Update()
        user_id_plag = 1
    data1 = {
    'user_ID': user_id,
    'sensor_type':S_type,
    'value':value,
    'unit':'%'
    }
    #print(type(temp))
    print(data1)
    response = requests.post(url+"api/logs/sensor-logs", json=data1)
    if(response.status_code==200):
        print('성공')
        log_debug("Post_temp")
        redata = False
    elif(response.status_code==400):
        redata = True
    print("response: ", response)
    print("response.text: ", response.text)
    if(redata == True):
        return True
    else:
        return False
    
def PostDHT(value1, value2):
    global user_id
    global user_id_plag
    replag = False;
    if(user_id_plag == 0):
        UserId_Update()
        user_id_plag = 1
    data1 = {
    'user_ID':user_id,
    'sensor_type':'temp',
    'value':value1,
    'unit':'C'
    }
    data2 = {
    'user_ID':user_id,
    'sensor_type':'humi',
    'value':value2,
    'unit':'%'
    }
    #print(type(temp))
    print(data1)
    response = requests.post(url+"api/logs/sensor-logs", json=data1)
    if(response.status_code==200):
        print('성공')
        log_debug("Post_temp")
        replag=False
    elif(response.status_code==400):
        replag=True
    print("response: ", response)
    print("response.text: ", response.text)
    response2 = requests.post(url+"api/logs/sensor-logs", json=data2)
    if(response2.status_code==200):
        print('성공')
        log_debug("Post_humi")
    elif(response.status_code==400):
        replag=True
    print("response: ", response2)
    print("response.text: ", response2.text)
    if(replag==True):
        return True
    else:
        return False
def PostAI(value):
    CapturePlant()
    fields = {
    "mac": value,
    "photo": ("plant.jpg", open("plant.jpg","rb").read(), "image/jpg")
    }
    body = MultipartEncoder(fields)
    header = {'Content-type': body.content_type}
    response = requests.post(url+"api/devices/photo", headers=header, data = body)
    print(response)
    print("response: ", response)
    print("response.text: ", response.text)
    if(response.status_code==200):
        print('성공')
        log_debug("Post_AI")
        return True
    else: return False
#PostActData("test", "Pump")
#PostActData("run", "Water_Pump")
#plag = PostAI('D8:3A:DD:1E:AB:24')
#print(plag)