import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Menu from '../components/Menu'
import TempChart from '../components/TempChart.js';
import WaterChart from '../components/WaterChart.js';
import SoilChart from '../components/SoilChart.js';
import axios from 'axios';


const WebModule = () => {
    const [result, setResult] = useState([]);
    const [device, setDevice] = useState([]);
    const [pump, setPump] = useState([]);
    const { id } = useParams(); // useParams 훅을 사용하여 URL 파라미터 접근

    useEffect(() => {
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/admin/devices/${id}`)
          .then(response => {
            if (response.data && !Array.isArray(response.data)) {
              console.log(response.data);
              setDevice(response.data.device);
            //   const preparedData = prepareChartData(response.data.sensorLogs); // 데이터 처리
            // setResult(preparedData); // 처리된 데이터를 state에 저장
              const latestPump = loadLatestPump(response.data.actuatorLogs);
              setPump(latestPump);
              console.log(latestPump);
            } else {
              console.error('Unexpected response format:', response.data);
            }
          })
          .catch(error => {
            console.error('There was an error fetching the device data:', error);
          })

      }, [id]);


    function loadLatestPump(rawData) {
        function formatDateTime(isoString) {
        const date = new Date(isoString);
        
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        const hours = date.getUTCHours().toString().padStart(2, '0'); // UTC 시간을 사용
        const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // UTC 분을 사용
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
        }
    
        // rawData가 배열인지 확인, 배열이 아니면 빈 배열 반환
        if (!Array.isArray(rawData) || rawData.length === 0) {
            console.log('No valid data provided');
            return []; // rawData가 유효한 배열이 아니면 빈 배열 반환
        }
    
        const sortedData = rawData.sort((a, b) => a.log_timestamp - b.log_timestamp).reverse();
        const pumpData = sortedData.filter(data => data.actuator_type === 'Pump').map(data => ({ time: data.log_timestamp}));
        console.log(sortedData)
        const latestData = sortedData[0];
        console.log(pumpData);
    
        if (!latestData) {
        return []; // 최신 데이터가 없으면 빈 배열 반환
        }
        
        const result = {  
        time: formatDateTime(latestData.log_timestamp),
        };
    
        return [pumpData];
    }

    function prepareChartData(rawData) {

        function formatDateTime(isoString) {
            const date = new Date(isoString);
        
            const year = date.getFullYear().toString().slice(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
        
            const hours = date.getUTCHours().toString().padStart(2, '0'); // UTC 시간을 사용
            const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // UTC 분을 사용
        
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        }

        const sortedData = rawData.sort((a, b) => a.log_timestamp - b.log_timestamp).reverse();
        const tempData = sortedData.filter(data => data.sensor_type === 'temp').map(data => ({ time: data.log_timestamp, value: data.value }));
        const humiData = sortedData.filter(data => data.sensor_type === 'humi').map(data => ({ time: data.log_timestamp, value: data.value }));
        const soilData = sortedData.filter(data => data.sensor_type === 'soil').map(data => ({ time: data.log_timestamp, value: data.value }));
        const waterData = sortedData.filter(data => data.sensor_type === 'water').map(data => ({ time: data.log_timestamp, value: data.value }));
        
        return rawData.map(data => {
            return {
                time: formatDateTime(data.log_timestamp),
                tempValue: tempData.find(temp => temp.time === data.log_timestamp)?.value || 0,
                humiValue: humiData.find(humi => humi.time === data.log_timestamp)?.value || 0,
                soilValue: soilData.find(soil => soil.time === data.log_timestamp)?.value || 0,
                waterValue: waterData.find(water => water.time === data.log_timestamp)?.value || 0,
            };
        }).filter((value, index, self) => self.findIndex(v => v.time === value.time) === index); // 중복 제거
    }

    useEffect(() => {
        if (!device.user_ID) return; // userId.Id가 없는 경우 함수를 종료하여 다음 단계로 넘어가지 않도록 함
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/logs/sensor-logs?user_ID=${device.user_ID}`)
        .then(response => {
            console.log(response.data[0]);
            const preparedData = prepareChartData(response.data[0]); // 데이터 처리
            setResult(preparedData); // 처리된 데이터를 state에 저장
        })
        .catch(error => console.log(error));
    }, [device]);

    return (
        <div className="flex web">
            <Menu />  
        <div className='contents'>
        <div className="darkTitle" style={{fontSize:"25px", width:"300px", height:"60px", margin:"10px"}}>
                    모듈 상세 정보 조회
                </div>
        <div className='flex' style={{width:"80vw", height:"44vh", justifyContent:"space-between", marginBottom:"10px" }}>
            {/* 온/습도 정보*/}
            <div className="border"style={{width:"40vw", height:"100%", margin:"10px"}}>
                <div className='greyBox' style={{fontSize:"20px", width:"150px", height:"50px"}}>온/습도 정보</div>
                <div style={{width:"95%", height:"80%", margin:"auto"}}>
                    <TempChart detailData={result} />
                </div>
            </div>
            {/* 토양 습도 정보 */}
            <div className="border" style={{width:"40vw", height:"100%", margin:"10px"}}>
                <div className='greyBox' style={{fontSize:"20px", width:"150px", height:"50px"}}>토양 습도 정보</div>
                <div style={{width:"95%", height:"80%", margin:"auto"}}>
                    <SoilChart detailData={result} />
                </div>
            </div>
        </div>
        <div className='flex' style={{width:"80vw", height:"44vh", justifyContent:"space-between"}}>
            {/* 수위 정보 */}
            <div className="border"style={{width:"40vw", height:"100%", margin:"10px"}}>
                <div className='flex' style={{justifyContent:"space-between"}}>
                    <div className='greyBox' style={{fontSize:"20px", width:"150px", height:"50px"}}>수위 정보</div>
                </div>
                <div style={{width:"95%", height:"80%", margin:"auto"}}>
                    <WaterChart detailData={result} />
                </div>
            </div>
            {/* 급수 내역 로그*/}
            <div className="border" style={{width:"40vw", height:"100%", margin:"10px"}}>
                <div className='greyBox' style={{fontSize:"20px", width:"150px", height:"50px", marginBottom:"30px"}}>급수 내역 로그</div>
                
                <div style={{ width:"80%", height:"65%", margin:"auto", overflowY:"auto", scrollbarColor:"gray", border:"none", borderRadius:"20px", backgroundColor:"lightgray", padding:"20px"}}>
                    {pump.map((log, index) => (
                        log[index] && log[index].time && (
                            <div key={index}>
                              {log[index].time}, 급수 작동
                            </div>
                        )
                    ))}
                </div>

            </div>
        </div>
        </div>
        </div>
    );
};

export default WebModule;