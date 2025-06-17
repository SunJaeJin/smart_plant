import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import axios from 'axios';

function FlowerInfo2() {
    const navigate = useNavigate();
    
    const [flower, setFlower] = useState(null);
    const { plantdata_ID } = useParams(); // useParams 훅을 사용하여 URL 파라미터 접근
    const [result, setResult] = useState([]);
   
    const [plant, setPlant] = useState([]);
    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/users/main-page-data')
            .then(response => {
                console.log(response.data.plants[0]);
                setPlant(response.data.plants[0]);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    // userId 불러오기
   const [userId, setUserId] = useState([]);
   useEffect(() => {
       axios.get(`http://ceprj.gachon.ac.kr:60007/api/users/id-info`)
       .then(response => {
           setUserId(response.data); // 서버로부터 받은 데이터를 state에 저장
           console.log(response.data)
       })
       .catch(error => console.log(error));
   }, []); // 컴포넌트가 마운트될 때 요청을 보냄

const saveMyFlower2 = async (plantdata_ID, user_plant_ID, humidity, light_demand, temperature, watering) => {
    try {
        const data = {
            plantdata_ID: plantdata_ID,
            humidity: humidity,
            light_demand: light_demand,
            temperature: temperature,
            watering: watering
        };
        const id = plant.user_plant_ID;
        console.log(id); // 함수 내부에서 호출
        const updateResponse = await axios.patch(`http://ceprj.gachon.ac.kr:60007/api/users/update-plant/${id}`, data);
        alert('식물 변경 성공.');
    } catch (error) {
        console.error('식물 변경 실패:', error);
        alert('식물 변경 실패');
    }
}

    useEffect(() => {
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/plantdata/plants/${plantdata_ID}`)
            .then(response => {
                console.log(response.data);
                setFlower(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, [plantdata_ID]); // id가 변경될 때마다 이 useEffect가 실행되어야 하므로, 의존성 배열에 id를 추가
    
    function sendFlowerNameToFlutter(plantName) {
        if (window.sendFlowerName) {
            window.sendFlowerName.postMessage(plantName);
            navigate('/Main');
        } else {
            console.error('객체를 찾을 수 없음');
        }
    }
    
    // 이미지 경로를 URL로 변환하는 함수
    function convertFilePathToUrl(filePath) {
        const baseUrl = "http://ceprj.gachon.ac.kr:60007";
        if (!filePath) {  // filePath가 undefined 또는 빈 문자열인 경우
            return `${baseUrl}/defaultImage.png`;  // 기본 이미지 URL을 반환
        }
        const fileName = filePath.split('/').pop();
        const newUrl = `${baseUrl}/${fileName}`;
        
        return newUrl;
    }

    const imageUrl = flower && flower.photo ? convertFilePathToUrl(flower.photo) : '';

    if (!flower) {
        return <div>데이터를 불러오는 중...</div>;
    }

    return (
    <div className='mobile'>
        <div className='topBar'></div>
        <div className='greenTop'>
                식물 상세 정보
        </div>
        <div className='body2'>
        <img className="greenBox" src={imageUrl} alt={flower.name} style={{maxHeight:"200px", maxWidth:"200px", padding:"20px", marginTop:"30px"}} />
        <div style={{position:"relative", bottom:"0px"}}>    
            <div className="greenTitle">{flower.name}</div>
            <div className='greenBox' style={{height:"290px"}}>
            <div className="whiteBox" style={{ width:"90%", maxHeight:"85%", fontSize:"15pt", overflowY:"auto", scrollbarColor:"gray", textAlign:"initial", padding:"20px", lineHeight: "1.5", boxSizing: "border-box"}}>
                학명 : {flower.scientific_name}<br/>
                <div style={{height:"7px"}}></div>
                물 주기 : {flower.watering}<br/>
                <div style={{height:"7px"}}></div>
                광 요구도 : {flower.light_demand}<br/>
                <div style={{height:"7px"}}></div>
                온도 : {flower.temperature}<br/>
                <div style={{height:"7px"}}></div>
                습도 : {flower.humidity}
                <div style={{height:"7px"}}></div>
                설명 : {flower.description}
            </div>
            </div>
            {/* 불러온 식물의 이름 전달 */}
            <button type="button" className='greenButton'
                onClick={() => {
                sendFlowerNameToFlutter(flower.name + ',' + userId.Id);
                saveMyFlower2({ plantdata_ID: flower.plantdata_ID, user_plant_ID: plant.user_plant_ID, humidity: flower.humidity, light_demand: flower.light_demand, temperature: flower.temperature, watering: flower.watering });
                }}
            style={{width:"100%", height:"80px", fontSize:"20pt", marginTop:"30px"}}>식물 변경하기</button>
        </div>
    </div>
    </div>
    );
}

export default FlowerInfo2;
