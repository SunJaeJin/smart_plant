import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Menu from '../components/Menu'
import axios from 'axios';

const WebDevice2 = () => {

    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [initialResults, setInitialResults] = useState([]); // 초기 데이터 상태
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 7; // 페이지 당 표시할 항목 수
 
   // 검색어가 변경될 때마다 이 함수를 실행합니다.
    useEffect(() => {
        handleSearch();
    }, [searchTerm]);

    // 검색 함수
    const handleSearch = () => {
        const filteredResults = initialResults.filter(result =>
            (result.device_ID && result.device_ID.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
            (result.user_ID && result.user_ID.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (result.name && result.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setResults(filteredResults); // 검색 결과를 상태에 설정
    };

    useEffect(() => {
        // 실제 API 엔드포인트로 변경
        axios.get('http://ceprj.gachon.ac.kr:60007/api/admin/devices')
            .then(response => {
                // Check if response.data is an array before setting the state
                if (Array.isArray(response.data)) {
                    setInitialResults(response.data); // 초기 데이터 설정을 올바르게 수정
                    setResults(response.data); // 검색되지 않은 상태에서 모든 데이터를 표시하기 위해 설정
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
                    setResults(prevDevices => prevDevices.filter(device => device.device_ID !== deviceId)); // UI에서 삭제
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
    const currentItems = results.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지에서 표시할 아이템
    const totalPage = Math.ceil(results.length / PAGE_SIZE); // 총 페이지 수

    const pages = [...Array(totalPage).keys()].map(n => n + 1); // 페이지 번호 배열

    function goToPage(pageNumber) {
        setCurrentPage(pageNumber);
    }

    return (
        <div className="flex web">
            <Menu />
                <div className='contents'>
                    <div className="darkTitle">
                        디바이스 목록
                    </div>
                    <form className='webSearch' style={{marginLeft:"30px"}}>
                    <input 
                        style={{width:"97.5%", height:"60%", border:"none", borderRadius:"10px", paddingLeft:"10px", fontFamily:"main_font", fontSize:"30px"}}
                        type="text"
                        placeholder="검색하기"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* <button style={{width:"10%", height:"100%", fontFamily:"main_font", fontSize:"30px", marginLeft:"20px"}} type="submit">검색</button> */}
                    </form>
                    <div className='flex'>
                        <div className='greyBox' style={{margin:"10px 40px 10px 30px"}}>디바이스 ID</div>
                        <div className='greyBox' style={{marginRight:"40px"}}>사용자 아이디</div>
                        <div className='greyBox' style={{marginRight:"40px"}}>디바이스 이름</div>
                        <div className='greyBox' style={{marginRight:"40px", width:"410px"}}>디바이스 정보</div>
                        <div className='greyBox' style={{width:""}}>디바이스 관리</div>
                    </div>
                    <div>
                        <li style={{listStyleType:"none", fontSize:"20px", width:"95%", maxHeight:"650px", overflowY:"auto"}}>
                            {currentItems.map((device) => {
                            return (
                            <li key={device.device_ID}>
                                <Link className="linkBorder" to={`/WebDeviceInfo/${device.device_ID}`}
                                    style={{ borderCollapse:"collapse", marginLeft:"30px", width:"97%", textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', backgroundColor:"white", fontSize:"32px"}}>
                                    <div className="userContent">{device.device_ID}</div>
                                    <div className="userContent">{device.user_ID}</div>
                                    <div className="userContent">{device.name}</div>
                                    <div className="userContent" style={{width:"410px"}}>{device.info}</div>
                                    <button className='deviceButton' style={{width:"120px", marginLeft:"40px"}} onClick={() => deleteDevice(device.device_ID)}>삭제</button>
                                </Link>
                            </li>
                            )
                        })}
                        </li>
                    <div>
                        {pages.map(page => (
                            <button key={page} onClick={() => goToPage(page)} disabled={currentPage === page} style={{fontSize:"40px", marginTop:"100px"}}>
                                {page}
                            </button>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default WebDevice2;