import React, {useEffect, useState} from 'react';
import '../App.css';
import Sidebar from '../components/Sidebar.js';
import DetailButtons from '../components/DetailButtons.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Module() {

    const navigate = useNavigate();

    // 자동 관리 모드를 관리하는 state
    const [isAutoOn, setAutoOn] = useState(null);
    const [isFanOn, setFanOn] = useState(null);
    const [isHumiOn, setHumiOn] = useState(null);
    const [isLedOn, setLedOn] = useState(null);
    const [deviceName, setDeviceName] = useState(''); // 메시지를 저장할 상태
    // 자동 모드
    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/users/main-page-data')
            .then(response => {
                console.log(response.data)
                // 서버로부터 받은 데이터의 mode 값을 확인하여 true 또는 false로 상태를 설정합니다.
                console.log("auto", response.data.systemAutoMode); // 응답 데이터 확인
                const isOn = response.data.systemAutoMode === 'on' ? true : false;
                setAutoOn(isOn);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    //BLE사용
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
    // LED
    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/devices/manual-settings/LED')
            .then(response => {
                console.log("led", response.data.state);
                const isOn = response.data.state === 'on' ? true : false;
                setLedOn(isOn);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    // Fan
    useEffect(() => {
        const CoolingFan = "Cooling Fan"
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/devices/manual-settings/${CoolingFan}`)
            .then(response => {
                console.log("fan", response.data.state);
                const isOn = response.data.state === 'on' ? true : false;
                setFanOn(isOn);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    // Humi
    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/devices/manual-settings/Humidifier')
            .then(response => {
                console.log("humi", response.data.state);
                const isOn = response.data.state === 'on' ? true : false;
                setHumiOn(isOn);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    //플러터통신
    function sendModuleToFlutter(ModuleSetting) {
        if (window.sendModuleSetting) {
            window.sendModuleSetting.postMessage(ModuleSetting);
        } else {
            console.error('객체를 찾을 수 없음');
        }
    }

    const startAuto = async () => {
        setAutoOn(true);
        // 자동 모드 켜기 추가
        const data = {
            mode: "on"
        };
        try {
            const updateResponse = await axios.patch(`http://ceprj.gachon.ac.kr:60007/api/devices/auto-mode-toggle`, data);
        } catch (error) {
            console.error(error);
        }
    };

    const stopAuto = async () => {
        setAutoOn(false);
        // 자동 모드 끄기 추가
        const data = {
            mode: "off"
        };
        try {
            const updateResponse = await axios.patch(`http://ceprj.gachon.ac.kr:60007/api/devices/auto-mode-toggle`, data);
        } catch (error) {
            console.error(error);
        }
    };

    const startLed = async () => {
        setLedOn(true);
        const data = {
            state: "on"
        };
        try {
            const updateResponse = await axios.patch(`http://ceprj.gachon.ac.kr:60007/api/devices/manual-settings/LED`, data);
        } catch (error) {
            console.error(error);
        }
    };

    const stopLed = async () => {
        setLedOn(false);
        const data = {
            state: "off"
        };
        try {
            const updateResponse = await axios.patch(`http://ceprj.gachon.ac.kr:60007/api/devices/manual-settings/LED`, data);
        } catch (error) {
            console.error(error);
        }
    };

    // 슬라이더의 값 상태를 관리합니다.
    const [value, setValue] = useState(50); // 기본값은 50으로 설정합니다.

    // 슬라이더의 값이 변경될 때 호출될 함수입니다.
    const handleChange = (event) => {
    setValue(event.target.value);
    sendModuleToFlutter(event.target.value);
    };

    const startFan = async () => {
        setFanOn(true);
        const data = {
            state: "on"
        };
        try {
            const CoolingFan = "Cooling Fan"
            const updateResponse = await axios.patch(`http://ceprj.gachon.ac.kr:60007/api/devices/manual-settings/${CoolingFan}`, data);
        } catch (error) {
            console.error(error);
        }
    };

    const stopFan = async () => {
        setFanOn(false);
        const data = {
            state: "off"
        };
        try {
            const CoolingFan = "Cooling Fan"
            const updateResponse = await axios.patch(`http://ceprj.gachon.ac.kr:60007/api/devices/manual-settings/${CoolingFan}`, data);
        } catch (error) {
            console.error(error);
        }
    };

    const startHumi = async () => {
        setHumiOn(true);
        const data = {
            state: "on"
        };
        try {
            const Humidifier = "Humidifier"
            const updateResponse = await axios.patch(`http://ceprj.gachon.ac.kr:60007/api/devices/manual-settings/${Humidifier}`, data);
        } catch (error) {
            console.error(error);
        }
    };

    const stopHumi = async() => {
        setHumiOn(false);
        const data = {
            state: "off"
        };
        try {
            const Humidifier = "Humidifier"
            const updateResponse = await axios.patch(`http://ceprj.gachon.ac.kr:60007/api/devices/manual-settings/${Humidifier}`, data);
        } catch (error) {
            console.error(error);
        }
    };


    if (isAutoOn === null && isLedOn === null && isFanOn === null && isHumiOn === null) {
        return <div>Loading...</div>;
    }
    return (
        
    <div className="mobile" style={{alignContent:"normal"}}>
        <div className='topBar'></div>
        {/* 페이지 타이틀 */}
        <div className='greenTop flex' style={{textAlign:"left", textIndent:"10px", justifyContent:"space-between"}}>      
            <div style={{}}>모듈 설정</div>
            <div><Sidebar /></div>
        </div>
        {/* 페이지 내용 */}
        <div className='body' >
            
            {/* 자동 관리 모드 */}
            <div className='greenBox' style={{height:"150px", fontSize:"17pt", padding:"5px 7px 5px 0px",  boxSizing: "border-box", marginTop:"20px"}}>
                <div className='flex' style={{height:"50%"}}>
                    <div className="whiteBox" style={{ width:"50%", height:"100%"}}>
                        자동 관리 모드
                    </div>
                    <div style ={{ width:"45%", height:"100%",fontSize:"20pt", alignContent:"center", marginLeft:"0px"}}>
                        <button style ={{ width:"50%", height:"60%",fontSize:"17pt", border:"2px solid black", backgroundColor: isAutoOn ? "whitesmoke" : "grey", color: 'black'}} className="btn btn-success" onClick={() => { startAuto(); stopFan(); stopLed(); stopHumi(); sendModuleToFlutter("AutoOn");}} disabled={isAutoOn}>
                        On
                        </button>
                        <button style ={{ width:"50%", height:"60%",fontSize:"17pt", border:"2px solid black", backgroundColor: !isAutoOn ? "whitesmoke" : "grey", color: 'black'}} className="btn btn-success" onClick={() => {stopAuto(); sendModuleToFlutter("AutoOff");}} disabled={!isAutoOn}>
                        Off
                        </button>
                    </div>
                </div>
                <button type="button" className='greenButton' style ={{ width:"45%", height:"35%",fontSize:"12pt", float:"right"}} onClick={()=> navigate('/Auto2')}>
                자동 관리 상세 설정
                </button>
            </div>

            {/* 물 주기 */}
            <div className='greenBox flex' style={{height:"65px", fontSize:"17pt", padding:"5px 7px 5px 0px",  boxSizing: "border-box", marginTop:"20px"}}>
                <div className="whiteBox" style={{ width:"50%", height:"85%"}}>
                    물 주기
                </div>
                <button type="button" className='greenButton' style ={{ width:"45%", height:"70%",fontSize:"12pt", float:"right"}} onClick={() => { stopAuto(); sendModuleToFlutter("Pump"); }}>
                수동 급수
                </button>
            </div>

            {/* LED */}
            <div className='greenBox' style={{height:"150px", fontSize:"17pt", padding:"5px 7px 5px 0px",  boxSizing: "border-box", marginTop:"20px"}}>
                <div className='flex' style={{height:"50%"}}>
                    <div className="whiteBox" style={{ width:"50%", height:"85%"}}>
                        LED
                    </div>
                    <div style ={{ width:"45%", height:"100%",fontSize:"20pt", alignContent:"center", marginLeft:"0px"}}>
                        <button style ={{ width:"50%", height:"60%",fontSize:"17pt", border:"2px solid black", backgroundColor: isLedOn ? "whitesmoke" : "grey", color: 'black'}} className="btn btn-success" onClick={() => { startLed(); stopAuto(); sendModuleToFlutter("LedOn");}} disabled={isLedOn}>
                        On
                        </button>
                        <button style ={{ width:"50%", height:"60%",fontSize:"17pt", border:"2px solid black", backgroundColor: !isLedOn ? "whitesmoke" : "grey", color: 'black'}} className="btn btn-success" onClick={() => { stopLed(); stopAuto(); sendModuleToFlutter("LedOff");}} disabled={!isLedOn}>
                        Off
                        </button>
                    </div>
                </div>
                {/* 슬라이더 */}
                <div className='flex' style={{height:"50%"}}>
                    <div className="whiteBox" style={{ width:"50%", height:"100%", background:"none"}}>
                        세기 조절
                    </div>
                    <div style ={{ width:"45%", height:"100%",fontSize:"20pt", alignContent:"center", marginLeft:"0px"}}>
                        <input
                            type="range"
                            min="0" // 최소값
                            max="255" // 최대값
                            value={value} // 현재값
                            onChange={handleChange}
                             // 값이 변경될 때 호출할 함수
                            style={{accentColor:"#255652"}}
                        />
                    </div>
                </div>
            </div>

            {/* 팬 / 가습기 */}
            <div className='greenBox' style={{height:"150px", fontSize:"17pt", padding:"5px 7px 5px 0px",  boxSizing: "border-box", marginTop:"20px", marginBottom:"20px"}}>
                <div className='flex' style={{height:"50%"}}>
                    <div className="whiteBox" style={{ width:"50%", height:"85%"}}>
                        쿨링 팬
                    </div>
                    <div style ={{ width:"45%", height:"100%",fontSize:"20pt", alignContent:"center", marginLeft:"0px"}}>
                        <button style ={{ width:"50%", height:"60%",fontSize:"17pt", border:"2px solid black", backgroundColor: isFanOn ? "whitesmoke" : "grey", color: 'black'}} className="btn btn-success"  onClick={() => { startFan(); stopAuto(); sendModuleToFlutter("FanOn");}} disabled={isFanOn}>
                        On
                        </button>
                        <button style ={{ width:"50%", height:"60%",fontSize:"17pt", border:"2px solid black", backgroundColor: !isFanOn ? "whitesmoke" : "grey", color: 'black'}} className="btn btn-success"  onClick={() => { stopFan(); stopAuto(); sendModuleToFlutter("FanOff");}} disabled={!isFanOn}>
                        Off
                        </button>
                    </div>
                </div>
                <div className='flex' style={{height:"50%"}}>
                    <div className="whiteBox" style={{ width:"50%", height:"85%"}}>
                        가습기
                    </div>
                    <div style ={{ width:"45%", height:"100%",fontSize:"20pt", alignContent:"center", marginLeft:"0px"}}>
                        <button style ={{ width:"50%", height:"60%",fontSize:"17pt", border:"2px solid black", backgroundColor: isHumiOn ? "whitesmoke" : "grey", color: 'black'}} className="btn btn-success" onClick={() => { startHumi(); stopAuto(); sendModuleToFlutter("HumiOn");}} disabled={isHumiOn}>
                        On
                        </button>
                        <button style ={{ width:"50%", height:"60%",fontSize:"17pt", border:"2px solid black", backgroundColor: !isHumiOn ? "whitesmoke" : "grey", color: 'black'}} className="btn btn-success" onClick={() => { stopHumi(); stopAuto(); sendModuleToFlutter("HumiOff");}} disabled={!isHumiOn}>
                        Off
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/* 하단 버튼 */}
        <DetailButtons />
    </div>
    );
}

export default Module;
