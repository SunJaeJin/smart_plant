import React, {useEffect, useState} from 'react';
import '../App.css';
import Sidebar from '../components/Sidebar.js';
import DetailButtons from '../components/DetailButtons.js';
import axios from 'axios';

function Auto2() {

    const [data, setData] = useState('');
    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/users/device-auto-settings')
        .then(response => {
            console.log(response.data[0]);
            const fetchedData = response.data[0];  // 데이터를 직접 변수에 저장
            setData(fetchedData);  // 상태를 업데이트
            // 직접 받아온 데이터를 사용하여 상태 업데이트
            setHumidityRange(fetchedData.humidity_range);
            setLedOffTime(fetchedData.led_off_time);
            setLedOnTime(fetchedData.led_on_time);
            setLightIntensity(fetchedData.light_intensity);
            setTempRange(fetchedData.temp_range);
            setWateringInterval(fetchedData.watering_interval);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }, []);

    const [humidityRange, setHumidityRange] = useState('');
    const [ledOffTime, setLedOffTime] = useState('');
    const [ledOnTime, setLedOnTime] = useState('');
    const [lightIntensity, setLightIntensity] = useState('');
    const [tempRange, setTempRange] = useState('');
    const [wateringInterval, setWateringInterval] = useState('');

    const handleHumidityRangeChange = (event) => setHumidityRange(event.target.value);
    const handleLedOffTimeChange = (event) => setLedOffTime(event.target.value);
    const handleLedOnTimeChange = (event) => setLedOnTime(event.target.value);
    const handleLightIntensityChange = (event) => setLightIntensity(event.target.value);
    const handleTempRangeChange = (event) => setTempRange(event.target.value);
    const handleWateringIntervalChange = (event) => setWateringInterval(event.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // 서버에 보낼 객체
            const autoMode = {
                humidity_range: humidityRange,
                led_off_time: ledOffTime,
                led_on_time: ledOnTime,
                light_intensity: lightIntensity,
                temp_range: tempRange,
                watering_interval: wateringInterval
            };
            const response = await axios.patch('http://ceprj.gachon.ac.kr:60007/api/users/auto-mode-settings', autoMode);
            alert('자동 모드 설정이 저장되었습니다.');
            console.log(response.data);
        } catch (error) {
            console.error('저장 실패:', error.response ? error.response.data : error);
        }
    };

    //플러터통신
    function sendAutoToFlutter(AutoSetting) {
        if (window.sendAutoSetting) {
            window.sendAutoSetting.postMessage(AutoSetting);
        } else {
            console.error('객체를 찾을 수 없음');
        }
    }

    const [plant, setPlant] = useState('');
    const [error, setError] = useState(''); // 에러 메시지를 저장할 상태 추가

    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/users/main-page-data')
          .then(response => {
            setPlant(response.data.plants[0]);
          })
          .catch(error => {
            console.error('There was an error!', error);
            setError('메인 페이지 데이터를 불러오는데 실패했습니다.');
          });
      }, []);
    
      const resetAutoData = (plantName) => { // 파라미터를 'plantName'으로 수정
        if (!plantName) {
          setError('식물 이름이 없습니다.');
          return;
        }
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/plantdata/match-plant?aiResult=${encodeURIComponent(plantName)}`)
          .then(response => {
            console.log(response.data);
            const fetchedData = response.data;  // 데이터를 직접 변수에 저장
            setData(fetchedData);  // 상태를 업데이트
            // 직접 받아온 데이터를 사용하여 상태 업데이트
            setHumidityRange(fetchedData.humidity);
            setLedOffTime(null);
            setLedOnTime(null);
            setLightIntensity(fetchedData.light_demand);
            setTempRange(fetchedData.temperature);
            setWateringInterval(fetchedData.watering);
          })
          .catch(err => {
            console.error('매칭된 식물 정보를 불러오는 중 에러 발생:', err);
            setError('매칭된 식물 정보를 불러오는데 실패했습니다.');
          });
      };


    return (
    <div className="mobile" style={{alignContent:"normal"}}>
        {/* 페이지 타이틀 */}
        <div className='topBar'></div>
        <div className='greenTop flex' style={{textAlign:"left", textIndent:"10px", justifyContent:"space-between"}}>      
            <div>자동 모드 상세 설정</div>
            <div><Sidebar /></div>
        </div>
        {/* 페이지 내용 */}
        <div className='body'>
        <form onSubmit={handleSubmit}>
            {/* 적정 온도 */}
            <div className='greenBox flex' style={{height:"60px", fontSize:"17pt", padding:"5px 7px 5px 0px",  boxSizing: "border-box", marginTop:"10px"}}>
                <div className="whiteBox" style={{ width:"45%", height:"85%"}}>
                    적정 온도
                </div>
                <div className="flex" style={{width:"42%"}}>
                    <input 
                        className='inputText2' 
                        type="text" 
                        placeholder=''
                        value={tempRange} 
                        onChange={handleTempRangeChange}
                        style={{width:"100%", height:"35px"}}
                    />
                </div>
            </div>

            {/* 적정 습도 */}
            <div className='greenBox flex' style={{height:"60px", fontSize:"17pt", padding:"5px 7px 5px 0px",  boxSizing: "border-box", marginTop:"10px"}}>
                <div className="whiteBox" style={{ width:"45%", height:"85%"}}>
                    적정 습도
                </div>
                <div className="flex" style={{width:"42%"}}>
                    <input 
                        className='inputText2' 
                        type="text" 
                        placeholder='' 
                        value={humidityRange} 
                        onChange={handleHumidityRangeChange}
                        style={{width:"100%", height:"35px"}}
                    />
                </div>
            </div>

            {/* LED 세기 */}
            <div className='greenBox' style={{height:"120px", fontSize:"17pt", padding:"5px 7px 0px 0px",  boxSizing: "border-box", marginTop:"10px"}}>
                <div className='flex' style={{height:"50%"}}>
                    <div className="whiteBox" style={{ width:"45%", height:"85%"}}>
                        LED 세기
                    </div>
                    <div style ={{ width:"45%", height:"100%",fontSize:"15pt", alignContent:"center", marginLeft:"0px"}}>
                    </div>
                </div>
                {/* 라디오 */}
                <div style ={{ width:"100%", height:"50%",fontSize:"17pt", alignContent:"center",margin:"auto", justifyContent:"center"}}>
                    <label htmlFor="weak" style={{ marginRight: "20px" }}>
                        <input
                        type="radio"
                        id="Low"
                        name="lightIntensity"
                        value="Low"
                        checked={lightIntensity === 'Low'}
                        onChange={handleLightIntensityChange}
                        style={{ accentColor: '#255652', scale:"1.5", marginRight:"5px" }}
                        />
                        약하게
                    </label>
                    <label htmlFor="normal" style={{ marginRight: "20px" }}>
                        <input
                        type="radio"
                        id="Medium"
                        name="lightIntensity"
                        value="Medium"
                        checked={lightIntensity === 'Medium'}
                        onChange={handleLightIntensityChange}
                        style={{ accentColor: '#255652', scale:"1.5", marginRight:"5px" }}
                        />
                        보통
                    </label>
                    <label htmlFor="strong">
                        <input
                        type="radio"
                        id="High"
                        name="lightIntensity"
                        value="High"
                        checked={lightIntensity === 'High'}
                        onChange={handleLightIntensityChange}
                        style={{ accentColor: '#255652', scale:"1.5", marginRight:"5px" }}
                        />
                        강하게
                    </label>
                </div>
            </div>

            {/* 급수 주기 */}
            <div className='greenBox' style={{height:"120px", fontSize:"17pt", padding:"5px 7px 0px 0px",  boxSizing: "border-box", marginTop:"10px"}}>
                <div className='flex' style={{height:"50%"}}>
                    <div className="whiteBox" style={{ width:"50%", height:"85%"}}>
                        급수 주기
                    </div>
                    <div style ={{ width:"45%", height:"100%",fontSize:"20pt", alignContent:"center", marginLeft:"0px"}}>
                    </div>
                </div>
                {/* 라디오 */}
                <div style ={{ width:"100%", height:"50%",fontSize:"17pt", alignContent:"center",margin:"auto", justifyContent:"center"}}>
                    <label htmlFor="min" style={{ marginRight: "20px" }}>
                        <input
                        type="radio"
                        id="Bi-weekly"
                        name="wateringInterval"
                        value="Bi-weekly"
                        checked={wateringInterval === 'Bi-weekly'}
                        onChange={handleWateringIntervalChange}
                        style={{ accentColor: '#255652', scale:"1.5", marginRight:"5px" }}
                        />
                        격주
                    </label>
                    <label htmlFor="normal" style={{ marginRight: "20px" }}>
                        <input
                        type="radio"
                        id="Weekly"
                        name="wateringInterval"
                        value="Weekly"
                        checked={wateringInterval === 'Weekly'}
                        onChange={handleWateringIntervalChange}
                        style={{ accentColor: '#255652', scale:"1.5", marginRight:"5px" }}
                        />
                        매주
                    </label>
                    <label htmlFor="max">
                        <input
                        type="radio"
                        id="Daily"
                        name="wateringInterval"
                        value="Daily"
                        checked={wateringInterval === 'Daily'}
                        onChange={handleWateringIntervalChange}
                        style={{ accentColor: '#255652', scale:"1.5", marginRight:"5px" }}
                        />
                        매일
                    </label>
                </div>
            </div>

            {/* 취침 모드 */}
            <div className='greenBox' style={{height:"140px", fontSize:"17pt", padding:"5px 7px 15px 0px",  boxSizing: "border-box", marginTop:"10px"}}>
                <div className='flex' style={{height:"50%"}}>
                    <div className="whiteBox" style={{ width:"50%", height:"85%"}}>
                        취침 모드
                    </div>
                    <div style ={{ width:"45%", height:"100%",fontSize:"20pt", alignContent:"center", marginLeft:"0px"}}>
                    </div>
                </div>
                {/* LED 시간 설정 */}
                <div style ={{ width:"100%", height:"50%",fontSize:"20pt", alignContent:"center"}}>
                    <label htmlFor="startSleep" style ={{fontSize:"15pt"}}>LED 켜짐 시간 설정: </label>
                    <input
                    type="time"
                    id="ledOnTime"
                    name="ledOnTime"
                    step="60"
                    value={ledOnTime}
                    onChange={handleLedOnTimeChange}
                    style={{position:"relative", left:"9px",bottom:"3px", scale:"1.2"}}
                    />
                    {/* <button type="submit">설정</button> */}
                    <br/>
                    <label htmlFor="endSleep" style ={{fontSize:"15pt"}}>LED 꺼짐 시간 설정: </label>
                    <input
                    type="time"
                    id="ledOffTime"
                    name="ledOffTime"
                    step="60"
                    value={ledOffTime}
                    onChange={handleLedOffTimeChange}
                    style={{position:"relative", left:"9px",bottom:"3px", scale:"1.2"}}
                    />
                </div>
            </div>
            <div>
                <button type="button" className='greenButton' style ={{ width:"100px", height:"50px",fontSize:"12pt", margin:"10px 20px 10px 0px"}} 
                   onClick={() => {
                    resetAutoData(plant.name) }}>
                초기화
                </button>
                <button type="submit" className='greenButton' style ={{ width:"100px", height:"50px",fontSize:"12pt"}}
                onClick={() => {
                    sendAutoToFlutter(tempRange+","+humidityRange+","+wateringInterval+","+lightIntensity+","+ledOffTime+","+ledOnTime) }}>
                저장
                </button>
            </div>
            </form>
        </div>
        {/* 하단 버튼 */}
        <DetailButtons />
    </div>
    );
}

export default Auto2;
