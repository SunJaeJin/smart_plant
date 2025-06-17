import requests
import configparser

#configr = configparser.ConfigParser()
#configr.read('/home/SJJ/python/test/plantdata.ini') #파일 존재하는지 확

def Get_Plant(plantname):
# JSON 데이터를 받아올 URL
    url = 'http://ceprj.gachon.ac.kr:60007/api/plantdata/plants/name/'
    # GET 요청 보내기
    response = requests.get(url+plantname)
    # 응답 확인
    if response.status_code == 200:
        # JSON 형식으로 응답을 파싱하여 데이터 얻기
        json_data = response.json()
        print('서버 응답:', json_data)
        configw = configparser.ConfigParser()
        configw['PLANT_DATA'] = {}
        print('water:', json_data['watering'])
        configw['PLANT_DATA']['WATERING'] = json_data['watering']
        print('temp:', json_data['temperature'])
        print(json_data['temperature'][0:2])
        configw['PLANT_DATA']['TEMP_LOW'] = json_data['temperature'][0:2]
        print(json_data['temperature'][3:5])
        configw['PLANT_DATA']['TEMP_HIGH'] = json_data['temperature'][3:5]
        print('humi:', json_data['humidity'])
        print(json_data['humidity'][0:2])
        configw['PLANT_DATA']['HUMI_LOW'] = json_data['humidity'][0:2]
        print(json_data['humidity'][3:5])
        configw['PLANT_DATA']['HUMI_HIGH'] = json_data['humidity'][3:5]
        print('light:', json_data['light_demand'])
        configw['PLANT_DATA']['LIGHT'] = json_data['light_demand']
        configw['PLANT_DATA']['LEDSTARTTIME'] = "NONE"
        configw['PLANT_DATA']['LEDSTOPTIME'] = "NONE"
        with open('/home/SJJ/python/plantdata.ini', 'w') as configfile:
            configw.write(configfile)
    else:
        print('GET 요청이 실패했습니다. 상태 코드:', response)

def Set_Auto(dataset):
    data = dataset.split(",")
    configw = configparser.ConfigParser()
    configw['PLANT_DATA'] = {}
    print('water:', data[2])
    configw['PLANT_DATA']['WATERING'] = data[2]
    print('temp:', data[0])
    print(data[0][0:2])
    configw['PLANT_DATA']['TEMP_LOW'] = data[0][0:2]
    print(data[0][3:5])
    configw['PLANT_DATA']['TEMP_HIGH'] = data[0][3:5]
    print('humi:', data[1])
    print(data[1][0:2])
    configw['PLANT_DATA']['HUMI_LOW'] = data[1][0:2]
    print(data[1][3:5])
    configw['PLANT_DATA']['HUMI_HIGH'] = data[1][3:5]
    print('light:', data[3])
    configw['PLANT_DATA']['LIGHT'] = data[3]
    print(data[4])
    configw['PLANT_DATA']['LEDSTARTTIME'] = data[4]
    print(data[5])
    configw['PLANT_DATA']['LEDSTOPTIME'] = data[5]
    
    with open('/home/SJJ/python/plantdata.ini', 'w') as configfile:
        configw.write(configfile)

#Get_Plant("데이지")