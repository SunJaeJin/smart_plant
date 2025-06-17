import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Loading = () => {
    const [deviceName, setDeviceName] = useState(''); // 메시지를 저장할 상태
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

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

    useEffect(() => {
        function handleMessage(event) {
            // 메시지의 출처를 확인하는 것이 좋습니다. 예: if (event.origin === "http://example.com")
            console.log("Received message:", event.data);
            setMessage(event.data); // 상태 업데이트
            if(event.data ==='connect'){
                alert('연결 성공');
                navigate('/Main');
            }
            // setPlantId(event.data);
            //alert('AI 판별 요청 성공');
            // navigate('/AI?plantId='+plantId);
            //navigate('/AI');
        }
        window.addEventListener("message", handleMessage);
       // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
        return () => {
            window.removeEventListener("message", handleMessage);
        };
        }, []);

    return (
        <div className='greenBack2 mobile'>
            <img src="/images/newArt.png" alt="자연 지능 화단 로고"  style={{marginBottom:"15px", border:"none", borderRadius:"50px", width:"200px"}} />
            <div className='whiteBox green3' style={{fontSize:"30pt", fontWeight:"bold", width:"300px", height:"70px"}}>
                자연 지능 화단
            </div>
            <div>
            <div className='greenTitle'>      
                로딩중
            </div>
            <div className='whiteBox' style={{width:"310px", height:"200px", fontSize:"17pt"}}>      
                기기 연결 대기중..<br/><br/>
                잠시만 기다려주세요.
            </div>
            </div>
            <div>
                <button type="button" className='greyButton' onClick={() => navigate('/Main')} style={{width:"120px", height:"55px", fontSize:"20px"}}>건너뛰기</button>
            </div>
        </div>
    );
};

export default Loading;
