import React, { useEffect, useState }from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import E from 'react-script';

function sendMessageToFlutterApp() {
    if (window.toApp) {
        window.toApp.postMessage('플러터 리액트 데이터 전송 테스트');
    } else {
        console.error('toApp 객체를 찾을 수 없음');
    }
}


const Device = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState(''); // 메시지를 저장할 상태

    useEffect(() => {
        function handleMessage(event) {
            // 메시지의 출처를 확인하는 것이 좋습니다. 예: if (event.origin === "http://example.com")
            console.log("Received message:", event.data);
            setMessage(event.data); // 상태 업데이트
                  // event.data를 사용하여 POST 요청
            if(event.data==='connect'){
             //alert(event.data);   
            }else{
                axios.post('http://ceprj.gachon.ac.kr:60007/api/devices/', {
                    data: event.data // event.data를 서버로 전송
                    })
                    .then(response => {
                    // 응답 처리
                    console.log('Server response:', response.data);
                    navigate('/Loading2');
                    })
                    .catch(error => {
                    // 에러 처리
                    console.error('There was an error!', error);
                    });
                    //navigate('/Loading2');
            }
            
        }
        window.addEventListener("message", handleMessage);
       // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
        return () => {
            window.removeEventListener("message", handleMessage);
        };
        }, []);
    
    useEffect(() => {
        // 컴포넌트가 마운트 되었을 때, 디바이스 등록 여부를 확인합니다.
        const checkUserDevice = async () => {
            try {
                // 백엔드 API 엔드포인트를 호출하여 디바이스 등록 여부를 확인합니다.
                const response = await axios.get('http://ceprj.gachon.ac.kr:60007/api/devices/check-device');
                if (response.data.hasDevice) {
                    // 등록된 디바이스가 있다면 사용자의 대시보드로 리디렉션합니다.
                    navigate('/Loading2');
                } else {
                    // 등록된 디바이스가 없다면 로딩 상태를 해제합니다.
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error checking the device:', error);
                setIsLoading(false); // 에러가 발생하면 로딩 상태를 해제합니다.
            }
        }
        
        checkUserDevice()
    }, [navigate])

    if (isLoading) {
        return <div>Loding...</div>
    }

    return (
        <div className='greenBack2 mobile'>
            <img src="/images/newArt.png" alt="자연 지능 화단 로고"  style={{marginBottom:"15px", border:"none", borderRadius:"50px", width:"200px"}} />
            <div className='whiteBox green3' style={{fontSize:"30pt", fontWeight:"bold", width:"300px", height:"70px"}}>
                자연 지능 화단
            </div>
            <div>
            <div className='greenTitle'>      
                기기 등록
            </div>
            <div className='whiteBox' style={{width:"310px", height:"170px", fontSize:"17pt"}}>      
                등록된 디바이스가 없습니다.<br/><br/>
                블루투스 연결을 진행해주세요.
            </div>
            </div>
            <div>
                <button type="button" className='greenButton' onClick={sendMessageToFlutterApp} style={{width:"140px", height:"55px", marginTop:"30px"}}>블루투스 찾기</button>
            </div>
        </div>
    );
};

export default Device;
