import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Flower = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [plantId, setPlantId] = useState('');

    useEffect(() => {
        // 식물 등록 여부를 확인합니다.
        const fetchPlants = async () => {
            try {
                const response = await axios.get('http://ceprj.gachon.ac.kr:60007/api/devices/check-plants');
                if (response.data.hasPlants) {
                    // 등록된 식물이 있으면 메인 화면으로 리디렉션
                    navigate('/Loading');
                } else {
                    // 등록된 식물이 없으면 로딩 상태 해제
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error checking plants:', error);
                setIsLoading(false); // 에러 발생 시 로딩 상태 해제
            }
        };

        fetchPlants();
    }, [navigate]);

    if (isLoading) {
        // 로딩 중인 경우 로딩 인디케이터 표시
        return <div>Loading...</div>;
    }


    // useEffect(() =>{
    //     function sendBleApp() {
    //         axios.get('http://ceprj.gachon.ac.kr:60007/api/devices/mac-address') // 디바이스 mac adrress을 요청하는 URL
    //         .then(response => {
    //             window.BleUse.postMessage(response.data.mac);
    //             if (response.data.length > 0) {
    //                 setDeviceName(response.data.mac)
    //             } else {
    //                 //alert('등록된 디바이스가 없습니다.');
    //             }
    //         })
    //         .catch(error => {
    //             // 에러 처리
    //             console.error('There was an error!', error);
    //             alert('디바이스 정보를 가져오는 중 오류가 발생했습니다.');
    //         });
    //     }
    //     sendBleApp()
    // }, [])

    return (
        <div className='greenBack2 mobile'>
            <img src="/images/newArt.png" alt="자연 지능 화단 로고"  style={{marginBottom:"15px", border:"none", borderRadius:"50px", width:"200px"}} />
            <div className='whiteBox green3' style={{fontSize:"30pt", fontWeight:"bold", width:"300px", height:"70px"}}>
                자연 지능 화단
            </div>
            <div>
            <div className='greenTitle'>      
                식물 등록
            </div>
            <div className='whiteBox' style={{width:"310px", height:"170px", fontSize:"17pt"}}>      
                등록된 식물이 없습니다.<br/><br/>
                식물 등록을 진행하시겠습니까?
            </div>
            </div>
            <div>
                <button type="button" className='greenButton' onClick={() => navigate('/FindFlower')} style={{width:"100px", height:"55px", marginRight:"20px"}}>예</button>
                <button type="button" className='greyButton' onClick={() => navigate('/')} style={{width:"100px", height:"55px", fontSize:"20px"}}>아니오</button>
            </div>
        </div>
    );
};

export default Flower;
