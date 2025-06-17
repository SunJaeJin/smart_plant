import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function DeviceList() {
    const navigate = useNavigate();

    const [devices, setDevices] = useState([]); // Ensure this is always an array
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 7; // 페이지 당 표시할 항목 수

    useEffect(() => {
        // 실제 API 엔드포인트로 변경
        axios.get('http://ceprj.gachon.ac.kr:60007/api/admin/devices')
            .then(response => {
                // Check if response.data is an array before setting the state
                if (Array.isArray(response.data)) {
                    setDevices(response.data); // 결과 데이터를 상태에 저장
                } else {
                    console.error('Expected an array of devices, but received:', response.data);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the device data!', error);
            });
    }, []);

    const deleteDevice = (deviceId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
        axios.delete(`http://ceprj.gachon.ac.kr:60007/api/devices/${deviceId}`)
            .then(() => {
                console.log('디바이스가 삭제되었습니다.');
                setDevices(prevDevices => prevDevices.filter(device => device.device_ID !== deviceId)); // UI에서 삭제
            })
            .catch(error => {
                console.error('디바이스 삭제 중 오류가 발생했습니다', error);
            });
    } else {
        console.log('디바이스 삭제가 취소되었습니다.');
    }
};

    const indexOfLastItem = currentPage * PAGE_SIZE;
    const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
    const currentItems = devices.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지에서 표시할 아이템
    const totalPage = Math.ceil(devices.length / PAGE_SIZE); // 총 페이지 수

    const pages = [...Array(totalPage).keys()].map(n => n + 1); // 페이지 번호 배열

    function goToPage(pageNumber) {
        setCurrentPage(pageNumber);
    }

    return (
    <div>
        <li style={{listStyleType:"none", fontSize:"20px", width:"95%", maxHeight:"650px", overflowY:"auto"}}>
            {currentItems.map((device) => {
            return (
            <li key={device.id}>
                <Link className="linkBorder" to={`/WebDeviceInfo/${device.device_ID}`}
                    style={{ borderCollapse:"collapse", marginLeft:"30px", width:"97%", textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', backgroundColor:"white", fontSize:"32px"}}>
                    <div className="userContent">{device.device_ID}</div>
                    <div className="userContent">{device.user_ID}</div>
                    <div className="userContent">{device.name}</div>
                    <div className="userContent" style={{width:"410px"}}>{device.info}</div>
                    {/* <button className='deviceButton' style={{width:"270px", margin:"0 10px 0 10px"}} onClick={() => navigate(`/WebDeviceInfo/${device.device_ID}`)}>상세정보 조회</button> */}
                    <button className='deviceButton' style={{width:"120px", marginLeft:"40px"}} onClick={() => deleteDevice(device.device_ID)}>삭제</button>
                </Link>
            </li>
            )
        })}
        </li>
    <div>
        {pages.map(page => (
            <button key={page} onClick={() => goToPage(page)} disabled={currentPage === page} style={{fontSize:"40px", marginTop:"50px"}}>
                {page}
            </button>
        ))}
        </div>
    </div>
    );
}

export default DeviceList;