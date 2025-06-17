import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import DetailButtons from '../components/DetailButtons';
import TempChart from '../components/TempChart';

function Temp2() {
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
        const tempData = sortedData.filter(data => data.sensor_type === 'temp').map(data => ({ time: data.log_timestamp, value: data.value }));
        const humiData = sortedData.filter(data => data.sensor_type === 'humi').map(data => ({ time: data.log_timestamp, value: data.value }));
    
        return rawData.map(data => {
            return {
                time: formatDateTime(data.log_timestamp),
                tempValue: tempData.find(temp => temp.time === data.log_timestamp)?.value || 0,
                humiValue: humiData.find(humi => humi.time === data.log_timestamp)?.value || 0,
            };
        }).filter((value, index, self) => self.findIndex(v => v.time === value.time) === index); // 중복 제거
    }

    // 현재 데이터 추출
    function loadNowData(rawData) {
        // 1. rawData를 log_timestamp 기준으로 오름차순 정렬
        const sortedData = rawData.sort((a, b) => a.log_timestamp - b.log_timestamp).reverse();
      
        // 2. 가장 최근 데이터 추출
        const latestData = sortedData[0];
      
        // 3. 온도, 습도 데이터 추출
        const tempData = rawData.filter(data => data.sensor_type === 'temp').map(data => ({ time: data.log_timestamp, value: data.value }));
        const humiData = rawData.filter(data => data.sensor_type === 'humi').map(data => ({ time: data.log_timestamp, value: data.value }));
      
        return [
          {
            time: latestData.log_timestamp,
            tempValue: tempData[0].value,
            humiValue: humiData[0].value,
          },
        ];
      }
      

    return (
        <div className="mobile">
            <div className='topBar'></div>
            <div className='greenTop flex' style={{textAlign:"left", textIndent:"10px", justifyContent:"space-between"}}>
                <div>온도 / 습도 정보</div>
                <div><Sidebar /></div>
            </div>
            <div className='body'>
                <div style={{width:"90%", height:"300px", margin:"auto"}}>
                    <TempChart detailData={result} />
                </div>
                <div style={{position:"relative", bottom:"15px"}}>
                    <div className="greenTitle">현재 온도 / 습도</div>
                    <div className='greenBox' style={{ height: "200px", marginBottom:"15px" }}>
                        <table className='rounded-table' style={{width:"100%", height:"100%",padding:"35px 20px 20px 20px", margin:"auto"}}>
                            <tr>
                            <th className="tableHeader">온도</th> <td className="tableData">{nowResult[0]?.tempValue}℃</td>
                            </tr>
                            <tr>
                            <th className="tableHeader">습도</th> <td className="tableData">{nowResult[0]?.humiValue}%</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <DetailButtons />
        </div>
    );
}

export default Temp2;