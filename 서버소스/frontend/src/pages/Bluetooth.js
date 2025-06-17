import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function sendMessageToFlutterApp() {
    if (window.toApp) {
        window.toApp.postMessage('플러터 리액트 데이터 전송 테스트');
    } else {
        console.error('toApp 객체를 찾을 수 없음');
    }
}

const Bluetooth = () => {
    const [message, setMessage] = useState(''); // 메시지를 저장할 상태

    useEffect(() => {
    function handleMessage(event) {
        // 메시지의 출처를 확인하는 것이 좋습니다. 예: if (event.origin === "http://example.com")
        console.log("Received message:", event.data);
        setMessage(event.data); // 상태 업데이트
              // event.data를 사용하여 POST 요청
        axios.post('http://ceprj.gachon.ac.kr:60007/api/devices/', {
        data: event.data // event.data를 서버로 전송
        })
        .then(response => {
        // 응답 처리
        console.log('Server response:', response.data);
        })
        .catch(error => {
        // 에러 처리
        console.error('There was an error!', error);
        });
    }
    window.addEventListener("message", handleMessage);
   // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
    return () => {
        window.removeEventListener("message", handleMessage);
    };
    }, []);
    const navigate = useNavigate();
    
    return (
        <div className='mobile'>
            <div className='greenTop'>
                블루투스 등록
            </div>
            <p>Received message: {message}</p> {/* 메시지 표시 */}
            {/* <img src="/images/bluetooth.png" alt="블루투스 등록 화면"  style={{ width:"100%", height:"520px"}}/> */}
            <button type="button" className='greenButton' onClick={sendMessageToFlutterApp} style={{width:"140px", height:"55px"}}>플러터 통신 확인</button>
            <button type="button" className='greenButton' onClick={()=> navigate('/Flower')} style={{width:"140px", height:"55px"}}>블루투스<br/> 등록 완료</button>
        </div>
    );
};

export default Bluetooth;