import React, { useState, useEffect } from 'react';
import '../App.css';
import Sidebar from '../components/Sidebar.js';
import DetailButtons from '../components/DetailButtons.js';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DeviceInfo() {
    const [deviceInfo, setDeviceInfo] = useState([]);
    const { id } = useParams(); // useParams 훅을 사용하여 URL 파라미터 접근

    useEffect(() => {
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/users/devices/${id}`)
            .then(response => {
                if (response.data && !Array.isArray(response.data)) {
                    // Assuming the response is an object directly containing the device data
                    setDeviceInfo(response.data);
                    console.log(response.data);
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the device data:', error);
            });
    }, [id]); // id가 변경될 때마다 이 useEffect가 실행되어야 하므로, 의존성 배열에 id를 추가

    return (
        <div className="mobile">
        {/* 페이지 타이틀 */}
        <div className='topBar'></div>
        <div className='greenTop flex' style={{textAlign:"left", textIndent:"10px", justifyContent:"space-between"}}>
            <div style={{}}>디바이스 상세 정보</div>
            <div><Sidebar /></div>
        </div>
        {/* 페이지 내용 */}
        <div className='body'>
            <div style={{marginTop:"30px"}}>
                <div className="greenTitle">디바이스 스펙</div>
                <div className='greenBox' style={{ height: "450px" }}>
                    <table className="rounded-table" style={{width:"100%", height:"100%",padding:"40px 20px 20px 20px", margin:"auto"}}>
                        <tr>
                        <th className="tableHeader" style={{width:"100px"}}>디바이스 ID</th> <td className="tableData">{deviceInfo.device_ID}</td>
                        </tr>
                        <tr>
                        <th className="tableHeader">사용자 ID</th> <td className="tableData">{deviceInfo.user_ID}</td>
                        </tr>
                        <tr>
                        <th className="tableHeader">디바이스 이름</th> <td className="tableData">{deviceInfo.name}</td>
                        </tr>
                        <tr>
                        <th className="tableHeader">기기 정보</th> <td className="tableData" style={{fontSize:"17px"}}>{deviceInfo.info}</td>
                        </tr>
                        <tr>
                        <th className="tableHeader">MAC 주소</th> <td className="tableData">{deviceInfo.mac}</td>
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

export default DeviceInfo;
