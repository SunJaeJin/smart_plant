import sys
sys.path.append('/home/SJJ/.local/lib/python3.9/site-packages')
import time
dht_type = 22 # DHT 타입
dht_pin = 23 # DHT핀 번호

import Adafruit_DHT

def DHT():
    i=0
    while i<20:
        humidity, temperature = Adafruit_DHT.read_retry(dht_type, dht_pin) # DHT에서 값을 가져옴
        if humidity is not None and temperature is not None: # 값이 없을 시 console에 출력하지 않음
            print('Temp={0:0.1f} C Humidity={1:0.1f}%'.format(temperature, humidity))

        i = i+1
        time.sleep(5)
DHT()