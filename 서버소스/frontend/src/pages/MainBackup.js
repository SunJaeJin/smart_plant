import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';
import Sidebar from '../components/Sidebar.js';
import DetailButtons from '../components/DetailButtons.js';
import axios from 'axios';


function Main() {

    // const [flower, setFlower] = useState(null);
    // const { id } = useParams(); // useParams 훅을 사용하여 URL 파라미터 접근
    const [device, setDevice] = useState([]);
    const [plants, setPlants] = useState([]);
    const [nowResult, setNowResult] = useState([]);
    const [pump, setPump] = useState([]);
    const [auto, setAuto] = useState([]);
    const [deviceName, setDeviceName] = useState(''); // 메시지를 저장할 상태

    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/users/main-page-data')
            .then(response => {
                console.log(response.data)
                setDevice(response.data.devices[0]);
                setPlants(response.data.plants[0]);
                setAuto(response.data.systemAutoMode);
                const nowData = loadNowData(response.data.sensorLogs);
                const latestPump = loadLatestPump(response.data.actuators);
                setPump(latestPump);
                console.log(latestPump)
                setNowResult(nowData); // 가장 최근 데이터 설정

                // const selectedFlower = flowers.find(p => p.id.toString() === id); // 업데이트된 결과를 바탕으로 선택된 식물을 찾음
                // setFlower(selectedFlower); // 선택된 식물 상태를 업데이트
                // console.log(selectedFlower);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);
    //BLE연결
    useEffect(() =>{
      function sendBleApp() {
          axios.get('http://ceprj.gachon.ac.kr:60007/api/devices/mac-address') // 디바이스 mac adrress을 요청하는 URL
          .then(response => {
              window.BleUse.postMessage(response.data.mac);
              if (response.data.length > 0) {
                  setDeviceName(response.data.mac)
              } else {
                  //alert('등록된 디바이스가 없습니다.');
              }
          })
          .catch(error => {
              // 에러 처리
              console.error('There was an error!', error);
              alert('디바이스 정보를 가져오는 중 오류가 발생했습니다.');
          });
      }
      sendBleApp()
  }, [])

    // 이미지 경로를 URL로 변환하는 함수
    function convertFilePathToUrl(filePath) {
        const baseUrl = "http://ceprj.gachon.ac.kr:60007";
        const fileName = filePath.split('/').pop();
        const newUrl = `${baseUrl}/${fileName}`;
        
        return newUrl;
    }

    const imageUrl = plants.device_photo ? convertFilePathToUrl(plants.device_photo) : '';
    const imageUrl2 = plants.default_photo ? convertFilePathToUrl(plants.default_photo) : '';

   // 최신 펌프 작동 내역
   function loadLatestPump(rawData) {
    function convertDateFormat(datetime) {
      // 날짜와 시간을 'YYYY-MM-DD HH:MM:SS' 형식으로 파싱합니다.
      const date = new Date(datetime);
    
      // 각 부분을 추출하여 포매팅합니다.
      const year = date.getFullYear().toString().slice(-2); // 년도의 마지막 두 자리
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // 월 (0을 추가하여 두 자리수 유지)
      const day = ('0' + date.getDate()).slice(-2); // 일 (0을 추가하여 두 자리수 유지)
      const hours = ('0' + date.getHours()).slice(-2); // 시 (0을 추가하여 두 자리수 유지)
      const minutes = ('0' + date.getMinutes()).slice(-2); // 분 (0을 추가하여 두 자리수 유지)
      const seconds = ('0' + date.getSeconds()).slice(-2); // 초 (0을 추가하여 두 자리수 유지)
    
      // 'YY-MM-DD HH:MM:SS' 형식으로 병합하여 반환합니다.
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const sortedData = rawData.sort((a, b) => a.log_timestamp - b.log_timestamp).reverse();
    
    const latestData = sortedData[0];
    console.log(latestData);

    if (!latestData) {
      return []; // 최신 데이터가 없으면 빈 배열 반환
    }
    
    const result = {  
      time: convertDateFormat(latestData.log_timestamp),
    };

    return [result];
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

    return (
    <div className="mobile">
        {/* 페이지 타이틀 */}
        <div className='topBar'></div>
        <div className='greenTop flex' style={{textAlign:"left", textIndent:"10px", width:"100%", justifyContent:"space-between"}}>
            <div>{device.name}의 디바이스</div>
            <div><Sidebar/></div>
        </div>
        {/* 페이지 내용 */}
        <div className='body'>
                      {
                plants.name ? (
                  <img
                    className="greenBox"
                    src={imageUrl || imageUrl2} // imageUrl이 없을 경우 기본 이미지 URL을 사용
                    alt={plants.name}
                    style={{
                      height: "250px",
                      maxWidth: "250px",
                      padding: "15px",
                      marginTop: "20px",
                    }}
                  />
                ) : (
                  <div className='greenBox'                     
                    style={{
                      height: "250px",
                      maxWidth: "250px",
                      padding: "15px",
                      marginTop: "20px",
                      fontSize:"25px"
                  }}>로딩중...</div>
                )
              }
            <div className="greenTitle">{plants.name}</div>
            <div className='greenBox' style={{ height: "250px", border:"none", borderRadius:"20", marginBottom:"52px" }}>
            <table style={{width:"100%", height:"100%",padding:"30px 10px 20px 10px", margin:"auto", marginTop:"10px"}}>
                    <tr>
                      <th className="tableHeader" style={{width:"70px"}}>온도</th> <td className="tableData">{nowResult[0]?.tempValue}℃</td>
                      <th className="tableHeader" style={{width:"70px"}}>습도</th> <td className="tableData">{nowResult[0]?.humiValue}%</td>
                    </tr>
                    <tr>
                    <th className="tableHeader">토양 습도</th> <td className="tableData">{nowResult[0]?.soilValue}%</td>
                    <th className="tableHeader">수위</th> <td className="tableData">{nowResult[0]?.waterValue}%</td>
                    </tr>
                    <tr style={{height:"65px"}}>
                    <th className="tableHeader">최근 급수<br/>내역</th><td className="tableData" style={{width:"80px", fontSize:"17px"}}>{pump[0]?.time}</td>
                    <th className="tableHeader">자동 관리<br/>시스템</th><td className="tableData" style={{width:"80px"}}>{auto}</td>
                    </tr>
                </table>
            </div>
            </div>
        {/* 하단 버튼 */}
        <div style={{marginTop:"0px"}}>
        <DetailButtons />
        </div>
        {/* <div className='' style={{height:"0px", backgroundImage: "linear-gradient(to top, #ffffff, #cbd0d8, #92a5b0, #597d84, #255652)"}}></div> */}
    </div>
    );
}

export default Main;
