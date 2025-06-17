import React, {useEffect, useState} from 'react';
import '../App.css';
import Sidebar from '../components/Sidebar.js';
import DetailButtons from '../components/DetailButtons.js';
import SoilChart from '../components/SoilChart.js';
import axios from 'axios';

function Soil2() {
    const [result, setResult] = useState([]);
    const [nowResult, setNowResult] = useState([]);

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
        if (!userId.Id) return; // userId.Id가 없는 경우 함수를 종료하여 다음 단계로 넘어가지 않도록 함
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/logs/sensor-logs?user_ID=${userId.Id}`)
        .then(response => {
            console.log(response.data[0]);
            const preparedData = prepareChartData(response.data[0]); // 데이터 처리
            const nowData = loadNowData(response.data[0]);
            console.log(nowData);
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
        const soilData = sortedData.filter(data => data.sensor_type === 'soil').map(data => ({ time: data.log_timestamp, value: data.value }));
    
        return rawData.map(data => {
            return {
                time: formatDateTime(data.log_timestamp),
                soilValue: soilData.find(soil => soil.time === data.log_timestamp)?.value || 0,
            };
        }).filter((value, index, self) => self.findIndex(v => v.time === value.time) === index); // 중복 제거
    }

    // 현재 데이터 추출
    function loadNowData(rawData) {
        // 1. rawData를 log_timestamp 기준으로 오름차순 정렬
        const sortedData = rawData.sort((a, b) => a.log_timestamp - b.log_timestamp).reverse();
      
        // 2. 가장 최근 데이터 추출
        const latestData = sortedData[0];
      
        // 3. 토양 습도 데이터 추출
        const soilData = rawData.filter(data => data.sensor_type === 'soil').map(data => ({ time: data.log_timestamp, value: data.value }));
      
        return [
          {
            time: latestData.log_timestamp,
            soilValue: soilData[0].value,
          },
        ];
      }


    return (
        <div className="mobile">
        <div className='topBar'></div>
        {/* 페이지 타이틀 */}
        <div className='greenTop flex' style={{textAlign:"left", textIndent:"10px", justifyContent:"space-between"}}>
            <div>토양 습도 정보</div>
            <div><Sidebar /></div>
        </div>
        {/* 페이지 내용 */}
        <div className='body'>
            <div style={{width:"95%", height:"342px", margin:"auto"}}>
                <SoilChart detailData={result} />
            </div>
            <div style={{position:"relative", bottom:"15px"}}>
                <div className="greenTitle">현재 토양 습도</div>
                <div className='greenBox' style={{ height: "120px", marginBottom:"15px" }}>
                    <table className='rounded-table' style={{width:"100%", height:"100%",padding:"35px 20px 20px 20px", margin:"auto"}}>
                        <tr>
                        <th className="tableHeader" style={{width:"110px"}}>현재 토양 습도</th> <td className="tableData">{nowResult[0]?.soilValue}%</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        {/* 하단 버튼 */}
        <DetailButtons />
    </div>
    );
}

export default Soil2;
