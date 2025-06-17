import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DeviceName= () => {
    const navigate = useNavigate();
    const [newDeviceName, setNewDeviceName] = useState('');
    const { id } = useParams(); // useParams 훅을 사용하여 URL 파라미터 접근
    const [deviceInfo, setDeviceInfo] = useState([]);

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
    
    useEffect(() =>{
        function sendBleApp() {
            axios.get('http://ceprj.gachon.ac.kr:60007/api/devices/mac-address') // 디바이스 mac adrress을 요청하는 URL
            .then(response => {
                window.BleUse.postMessage(response.data.mac);
                if (response.data.length > 0) {
                    setNewDeviceName(response.data.mac)
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
    

    const handleNewDeviceNameChange = (event) => {
        setNewDeviceName(event.target.value);
    };

    
    function sendDeviceNameToFlutter(DeviceName) {
        if (window.sendDeviceName) {
            window.sendDeviceName.postMessage(DeviceName);
        } else {
            console.error('객체를 찾을 수 없음');
        }
    }

    const handleChangeDeviceName = async () => {
        try {
            const response = await axios.patch('http://ceprj.gachon.ac.kr:60007/api/devices/update-name', {
                device_ID: deviceInfo.device_ID,
                newName: newDeviceName
            });
            alert('디바이스 이름이 성공적으로 변경되었습니다.');
            navigate('/Main');
        } catch (error) {
            console.error('실패:', error);
        }
    };

    return (
        <div className='greenBack mobile'>
            <div className='topBar'></div>
            <div className='greenTop'>
                디바이스명 변경
            </div>
            <div className='body2'>
            <div className='whiteBox marginI' style={{width:"300px", height:"250px", fontSize:"25px", marginTop:"20px !important"}}>
                변경할 디바이스명을<br/>입력해주세요.<br/><br/>디바이스명은 메인화면<br/>좌측 상단에 표시됩니다.
            </div>
            <div style={{marginTop:"20px"}}>
            <div style={{marginBottom:"10px"}}>새 디바이스 명</div>
                <input className='inputText' type="text" value={newDeviceName} onChange={handleNewDeviceNameChange} placeholder='Enter New Name'></input>
            </div>
            <button type="submit" className='greenButton' 
            onClick={() => {
            sendDeviceNameToFlutter(newDeviceName);
            handleChangeDeviceName();
            }}
             style={{width:"100px", height:"45px", marginTop:"30px"}}>변경</button>
        </div>
        </div>
        //onClick={handleChangeDeviceName}
    );
};

export default DeviceName;
