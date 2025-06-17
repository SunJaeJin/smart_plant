import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DeleteDevice = ({ mac }) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const { id } = useParams(); // useParams 훅을 사용하여 URL 파라미터 접근
    const [deviceInfo, setDeviceInfo] = useState([]);

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    //BLEend
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

    function sendBLEendFlutter() {
        if (window.BLEend) {
            window.BLEend.postMessage();
        } else {
            console.error('객체를 찾을 수 없음');
        }
    }

    const handleDeleteDevice = async () => {
        try {
            const response = await axios.delete(`http://ceprj.gachon.ac.kr:60007/api/devices/${deviceInfo.mac}`, {
                data: {
                    password: password
                }
            });
            if (response.status === 200) {
                alert('디바이스 삭제가 완료되었습니다.');
                navigate('/Device'); // 삭제 성공 후 홈으로 리다이렉션
            }
        } catch (error) {
            console.error('삭제 실패:', error);
        }
    };
    function sendInitToFlutter(Init) {
        if (window.sendInitSetting) {
            window.sendInitSetting.postMessage(Init);
        } else {
            console.error('객체를 찾을 수 없음');
        }
    }
    return (
        <div className='greenBack mobile'>
            <div className='topBar'></div>
            <div className='greenTop'>
                디바이스 삭제
            </div>
            <div className='body2'>
            <div className='whiteBox marginI' style={{width:"300px", height:"250px", fontSize:"25px", marginTop:"20px !important"}}>
                디바이스 삭제를 원하시면<br/><br/>
                비밀번호를<br/>입력하세요.
            </div>
            <div style={{marginTop:"30px"}}>
                <div style={{marginBottom:"10px"}}>비밀번호</div>
                <input className='inputText' type="password" value={password} onChange={handlePasswordChange} placeholder='Enter Password'></input>
            </div>
            <button type="submit" className='greenButton' onClick={()=>{sendInitToFlutter("Init"); handleDeleteDevice();}} style={{width:"100px", height:"45px", marginTop:"30px"}}>삭제</button>
        </div>
        </div>
    );
};

export default DeleteDevice;