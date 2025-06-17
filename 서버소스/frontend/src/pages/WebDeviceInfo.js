import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Menu from '../components/Menu'
import axios from 'axios';

const WebDeviceInfo = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

    const [deviceInfo, setDeviceInfo] = useState([]);
    const [autoInfo, setAutoInfo] = useState([]);
    const [actuator, setActuator] = useState([]);
    const [nowResult, setNowResult] = useState([]);
    const [result, setResult] = useState([]);
    const [plants, setPlants] = useState([]);

    const { id } = useParams(); // useParams 훅을 사용하여 URL 파라미터 접근

    useEffect(() => {
        setIsLoading(true); // 데이터 요청 전 로딩 상태를 true로 설정
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/admin/devices/${id}`)
          .then(response => {
            if (response.data && !Array.isArray(response.data)) {
              console.log(response.data);
              setResult(response.data.autoSystemMode);
              setAutoInfo(response.data.autoSettings);
              setDeviceInfo(response.data.device);
              setPlants(response.data.plants[0]);

              const nowData = loadNowData(response.data.sensorLogs);
              setNowResult(nowData); // 가장 최근 데이터 설정
              const latestPump = loadLatestPump(response.data.actuatorLogs);
              setActuator(latestPump);
              console.log(latestPump);
            } else {
              console.error('Unexpected response format:', response.data);
            }
          })
          .catch(error => {
            console.error('There was an error fetching the device data:', error);
          })
          .finally(() => {
            setIsLoading(false); // 데이터 요청 완료 후 로딩 상태를 false로 설정
          });
      }, [id]);

   // 최신 펌프 작동 내역
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

    const sortedData = rawData.sort((a, b) => a.log_timestamp - b.log_timestamp).reverse();
    
    const latestData = sortedData[0];
    console.log(latestData);

    if (!latestData) {
      return []; // 최신 데이터가 없으면 빈 배열 반환
    }
    
    const result = {  
      time: formatDateTime(latestData.log_timestamp),
    };

    return [latestData];
  }

    // 현재 데이터 불러오기
    function loadNowData(rawData) {
        const sortedData = rawData.sort((a, b) => a.log_timestamp - b.log_timestamp).reverse();
        
        const latestData = sortedData[0];
        const tempData = rawData.filter(data => data.sensor_type === 'temp').map(data => ({ time: data.log_timestamp, value: data.value }));
        const humiData = rawData.filter(data => data.sensor_type === 'humi').map(data => ({ time: data.log_timestamp, value: data.value }));
        const soilData = rawData.filter(data => data.sensor_type === 'soil').map(data => ({ time: data.log_timestamp, value: data.value }));
        const waterData = rawData.filter(data => data.sensor_type === 'water').map(data => ({ time: data.log_timestamp, value: data.value }));
        const pumpData = rawData.filter(data => data.actuator_type === 'Water_Pump').map(data => ({ time: data.log_timestamp, action: data.action }));

        if (!latestData) {
          return []; // 최신 데이터가 없으면 빈 배열 반환
        }
        
        const result = {
          time: latestData.log_timestamp,
        };
      
        if (tempData.length > 0) {
          result.tempValue = tempData[0].value; // 온도 데이터가 있으면 추가
        }
        if (humiData.length > 0) {
          result.humiValue = humiData[0].value; // 습도 데이터가 있으면 추가
        }
        if (soilData.length > 0) {
          result.soilValue = soilData[0].value; // 토양 데이터가 있으면 추가
        }
        if (waterData.length > 0) {
          result.waterValue = waterData[0].value; // 급수 데이터가 있으면 추가
        }
        if (pumpData.length > 0) {
          result.latestPump = pumpData[0].time; // 급수 데이터가 있으면 추가
        }
        return [result];
      }

    // 이미지 경로를 URL로 변환하는 함수
    function convertFilePathToUrl(filePath) {
      const baseUrl = "http://ceprj.gachon.ac.kr:60007";
      const fileName = filePath.split('/').pop();
      const newUrl = `${baseUrl}/${fileName}`;
      
      return newUrl;
  }

  const imageUrl = plants.device_photo ? convertFilePathToUrl(plants.device_photo) : '';
  const imageUrl2 = plants.default_photo ? convertFilePathToUrl(plants.default_photo) : '';

  // 데이터 로딩 중 UI
  if (isLoading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

    return (
        <div className="flex web">
            <Menu />
            <div className='flex'>
                <div className='contents'>
                    <div className="darkTitle" style={{margin:"10px 0 0 90px", width:"360px"}}>
                        디바이스 상세 정보
                    </div>
                    <div style={{position:"relative", bottom:"50px"}}>
                    <button onClick={() => navigate(`/WebModule/${deviceInfo.device_ID}`)} type="button" className='darkButton' style={{width:"330px", height:"70px", margin:"0 0 0 950px"}}>모듈 상세 정보 조회</button>
                
                <div className='flex' style={{marginTop:"30px", width:"90%", margin:"0"}}>
                    {/* 촬영한 식물 이미지 */}
                    {/* <img
                            className="greyBox"
                            src={'/images/image.png'} // imageUrl이 없을 경우 기본 이미지 URL을 사용
                            alt={'디바이스 식물 사진'}
                            style={{ height: "350px", width: "350px", padding: "20px", margin:"0 120px 0 130px"}}
                        /> */}
                            {
                        plants.name && (
                        <img
                            className="greyBox"
                            src={imageUrl || imageUrl2} // imageUrl이 없을 경우 기본 이미지 URL을 사용
                            alt={'디바이스 식물 사진'}
                            style={{ height: "350px", width: "350px", padding: "20px", margin:"0 120px 0 130px", borderRadius:"20px"}}
                        />
                        )
                    }
                    {/* 디바이스 스펙 */}
                    <div style={{backgroundColor:"#F5F5F5", width:"55%", border:"none", borderRadius:"10px"}}>
                        <div className="darkTitle" style={{margin:"20px 0 10px 10px", width:"200px", fontSize:"30px", height:"80px"}}>
                            디바이스 스펙
                        </div>
                        <table style={{width:"100%", height:"65%",padding:"10px 10px 20px 10px", margin:"auto", marginTop:"0px"}}>
                            <tr>
                            <th className="tableHeader3">디바이스 ID</th> <td className="tableData3">{deviceInfo.device_ID}</td>
                            <th className="tableHeader3">사용자 ID</th> <td className="tableData3">{deviceInfo.user_ID}</td>
                            </tr>
                            <tr>
                            <th className="tableHeader3">디바이스 이름</th> <td className="tableData3">{deviceInfo.name}</td>
                            <th className="tableHeader3">기기 정보</th> <td className="tableData3">{deviceInfo.info}</td>
                            </tr>
                            <tr>
                            <th className="tableHeader3">MAC 주소</th> <td className="tableData3" colSpan="3">{deviceInfo.mac}</td>
                            </tr>
                        </table>
                    </div>
                    </div>
                </div>
                <div className='flex' style={{marginLeft:"10px", width:"90%", margin:"0 0 0 40px"}}>
                {/* 화단 상세 쩡보 */}
                <div style={{backgroundColor:"#F5F5F5", width:"47%", border:"none", borderRadius:"10px", height:"350px"}}>
                        <div className="darkTitle" style={{margin:"20px 0 10px 10px", width:"300px", fontSize:"30px", height:"70px"}}>
                            화단 상세 정보
                        </div>
                        <table style={{width:"100%", height:"65%",padding:"10px 10px 20px 10px", margin:"auto", marginTop:"0px"}}>
                            <tr>
                            <th className="tableHeader3">온도</th> <td className="tableData3">{nowResult[0]?.tempValue}°C</td>
                            <th className="tableHeader3">습도</th> <td className="tableData3">{nowResult[0]?.humiValue}%</td>
                            </tr>
                            <tr>
                            <th className="tableHeader3">토양 습도</th> <td className="tableData3">{nowResult[0]?.soilValue}%</td>
                            <th className="tableHeader3">수위</th> <td className="tableData3">{nowResult[0]?.waterValue}%</td>
                            </tr>
                            <tr>
                            <th className="tableHeader3">최근 급수 내역</th> <td  style={{width:"190px"}} className="tableData3">{actuator[0]?.log_timestamp}</td>
                            <th className="tableHeader3">자동 관리 시스템</th>
                            {result && result.mode && (
                                <td className="tableData3">{result.mode}</td>
                            )}
                            </tr>
                        </table>
                </div>
                {/* 자동모드 상세 설정 */}
                <div style={{backgroundColor:"#F5F5F5", width:"45.5%", border:"none", borderRadius:"10px", marginLeft:"50px", height:"350px"}}>
                        <div className="darkTitle" style={{margin:"20px 0 10px 10px", width:"300px", fontSize:"30px", height:"70px"}}>
                            자동 모드 상세 설정
                        </div>
                        <table style={{width:"100%", height:"65%",padding:"10px 10px 20px 10px", margin:"auto", marginTop:"0px"}}>
                            <tr>
                            <th className="tableHeader3">적정 온도</th> <td className="tableData3">{autoInfo.temp_range}</td>
                            <th className="tableHeader3">습도</th> <td className="tableData3">{autoInfo.humidity_range}</td>
                            </tr>
                            <tr>
                            <th className="tableHeader3">LED 세기</th> <td className="tableData3">{autoInfo.light_intensity}</td>
                            <th className="tableHeader3">급수 주기</th> <td className="tableData3">{autoInfo.watering_interval}</td>
                            </tr>
                        </table>
                </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default WebDeviceInfo;