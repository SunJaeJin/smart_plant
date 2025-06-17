import React, {useEffect, useState} from 'react';
import '../App.css';
import Sidebar from '../components/Sidebar.js';
import DetailButtons from '../components/DetailButtons.js';
import axios from 'axios';
import WaterChart from '../components/WaterChart.js';

function Water() {

    const [result, setResult] = useState([]);
    const [nowResult, setNowResult] = useState([]);
    const [pump, setPump] = useState([]);

    // userId 불러오기
    const [userId, setUserId] = useState([]);
    useEffect(() => {
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/users/id-info`)
        .then(response => {
            setUserId(response.data); // 서버로부터 받은 데이터를 state에 저장
            console.log(response.data)
        })
        .catch(error => console.log(error));
    }, []); // 컴포넌트가 마운트될 때 요청을 보냄


    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/users/main-page-data')
            .then(response => {
                const latestPump = loadLatestPump(response.data.actuators);

                setPump(latestPump);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []); // id가 변경될 때마다 이 useEffect가 실행되어야 하므로, 의존성 배열에 id를 추가


    useEffect(() => {
        if (!userId.Id) return; // userId.Id가 없는 경우 함수를 종료하여 다음 단계로 넘어가지 않도록 함
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/logs/sensor-logs?user_ID=${userId.Id}`)
        .then(response => {
            const preparedData = prepareChartData(response.data[0]); // 데이터 처리
            const nowData = loadNowData(response.data[0]);
            setResult(preparedData); // 처리된 데이터를 state에 저장
            setNowResult(nowData); // 가장 최근 데이터 설정
        })
        .catch(error => console.log(error));
    }, [userId]); // userId 상태가 바뀔 때마다 요청을 보냄

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

        const waterData = sortedData.filter(data => data.sensor_type === 'water').map(data => ({ time: data.log_timestamp, value: data.value }));
        console.log(waterData)
        return rawData.map(data => {
            return {
                time: formatDateTime(data.log_timestamp),
                waterValue: waterData.find(water => water.time === data.log_timestamp)?.value || 0,
            };
        }).filter((value, index, self) => self.findIndex(v => v.time === value.time) === index); // 중복 제거
    }

    // 현재 데이터 추출
    function loadNowData(rawData) {
        // 1. rawData를 log_timestamp 기준으로 오름차순 정렬
        const sortedData = rawData.sort((a, b) => a.log_timestamp - b.log_timestamp).reverse();
      
        // 2. 가장 최근 데이터 추출
        const latestData = sortedData[0];
      
        // 3. 수위 데이터 추출
        const waterData = rawData.filter(data => data.sensor_type === 'water').map(data => ({ time: data.log_timestamp, value: data.value }));
      
        return [
          {
            time: latestData.log_timestamp,
            waterValue: waterData[0].value,
          },
        ];
      }

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

    // rawData가 배열인지 확인, 배열이 아니면 빈 배열 반환
    if (!Array.isArray(rawData) || rawData.length === 0) {
        console.log('No valid data provided');
        return []; // rawData가 유효한 배열이 아니면 빈 배열 반환
    }

    const sortedData = rawData.sort((a, b) => a.log_timestamp - b.log_timestamp).reverse();
    console.log(sortedData)
    const latestData = sortedData[0];
    console.log(latestData);

    if (!latestData) {
    return []; // 최신 데이터가 없으면 빈 배열 반환
    }
    
    const result = {  
    time: formatDateTime(latestData.log_timestamp),
    };

    return [result];
}

    return (
        <div className="mobile">
        {/* 페이지 타이틀 */}
        <div className='topBar'></div>
        <div className='greenTop flex' style={{textAlign:"left", textIndent:"10px", justifyContent:"space-between"}}>
            <div style={{}}>급수 / 수위 정보</div>
            <div><Sidebar /></div>
        </div>
        {/* 페이지 내용 */}
        <div className='body'>
            <div style={{width:"95%", height:"250px", margin:"auto"}}>
                    <WaterChart detailData={result} />
            </div>
            <div style={{position:"relative", bottom:"25px"}}>
                <div className="greenTitle" style={{width:"230px",height:"40px", top:"20px"}}>최근 급수 내역 / 현재 수위</div>
                <div className='greenBox' style={{ height: "150px", marginBottom:"15px" }}>
                    <table className='rounded-table' style={{width:"100%", height:"100%",padding:"25px 20px 15px 20px", margin:"auto"}}>
                        <tr>
                        <th className="tableHeader" style={{width:"110px", height:"50%"}}>최근 급수 내역</th> <td className="tableData">{pump[0]?.time}</td>
                        </tr>
                        <tr>
                        <th className="tableHeader" style={{width:"60px"}}>수위</th> <td className="tableData">{nowResult[0]?.waterValue}%</td>
                        </tr>
                    </table>
                </div>
                <div style={{position:"relative", bottom:"20px"}}>
                    <div className="greenTitle" style={{height:"40px", top:"20px"}}>작동 로그</div>
                    <div className='greenBox' style={{ height: "140px" }}>
                    <div className="whiteBox" style={{ width:"90%", height:"85%", fontSize:"17pt", overflowY:"auto", scrollbarColor:"gray"}}>
                        {pump.map((log, index) => (
                            <div key={index}>
                            {log.time}, 급수 작동
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                <div style={{position:"relative", bottom:"5px"}}>
            
                </div>
            </div>
        </div>
        {/* 하단 버튼 */}
        <DetailButtons />
    </div>
    );
}

export default Water;
