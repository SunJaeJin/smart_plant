import React, {useEffect, useState} from 'react';
import { useNavigate, useRevalidator, useLocation } from 'react-router-dom';
import '../App.css';
import axios from 'axios';

function AI2() {
    const navigate = useNavigate();

    const [plant, setPlant] = useState([]);
    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/users/main-page-data')
            .then(response => {
                setPlant(response.data.plants[0]);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);


    useEffect(() => {
        sendBleApp();
    },[]);
    function sendBleApp() {
        if (window.BleUse) {
            window.BleUse.postMessage('이 페이지에서 Ble를 사용합니다');
        } else {
            console.error('객체를 찾을 수 없음');
        }
    }

    const saveMyFlower2 = async (plantdata_ID, photo_ID, user_plant_ID, humidity, light_demand, temperature, watering) => {
        try {
            // 서버에 보낼 객체
            const data = {
                plantdata_ID: plantdata_ID,
                photo_ID: photo_ID,
                humidity: humidity,
                light_demand: light_demand,
                temperature: temperature,
                watering: watering
            };
            const id = plantDetails.user_plant_ID;
            console.log(id); // 함수 내부에서 호출
            const updateResponse = await axios.patch(`http://ceprj.gachon.ac.kr:60007/api/users/update-plant/${id}`, data);
            alert('식물 변경 성공.');
        } catch (error) {
            console.error('식물 변경 실패:', error);
            alert(error);
        }
    };


    function sendFlowerNameToFlutter(plantName) {
        if (window.sendFlowerName) {
            window.sendFlowerName.postMessage(plantName);
            navigate('/Main');
        } else {
            console.error('객체를 찾을 수 없음');
        }
    }

    // // 데이터 베이스 식물 정보 get 요청
    const [plantDetails, setPlantDetails] = useState(null); // 식물 상세 정보 상태
    const [photoUrl, setPhotoUrl] = useState(''); // 사진 URL 상태
    const [error, setError] = useState(''); // 에러 메시지 상태
    const [result, setResult] = useState([]);
    const [latestResult, setLatestResult] = useState(null);

    useEffect(() => {
        fetchLatestPhotoResult();
    }, []);

    function fetchLatestPhotoResult() {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/devices/latest-photo-result')
          .then(response => {
            console.log(response.data);
            setLatestResult(response.data);
            if (response.data.latestResult) {
                console.log(response.data.latestResult.ai_result);
              fetchMatchedPlant(response.data.latestResult.ai_result);
            } else {
              setError('최근 사진이 없습니다.');
            }
          })
          .catch(err => {
            console.error('최신 사진 결과를 불러오는 중 에러 발생:', err);
            setError('최신 사진 결과를 불러오는데 실패했습니다.');
          });
      }


    const fetchMatchedPlant = (aiResult) => {
        if (!aiResult) {
          setError('AI 결과가 없습니다.');
          return;
        }
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/plantdata/match-plant?aiResult=${encodeURIComponent(aiResult)}`)
          .then(response => {
            console.log(response.data);
            console.log(response.data.plantdata_ID)
            setPlantDetails(response.data);
          })
          .catch(err => {
            console.error('매칭된 식물 정보를 불러오는 중 에러 발생:', err);
            setError('매칭된 식물 정보를 불러오는데 실패했습니다.');
          });
      };

    function convertFilePathToUrl(filePath) {
        // 기본 웹 서버 주소와 포트 번호
        const baseUrl = "http://ceprj.gachon.ac.kr:60007";
        // 파일 경로에서 파일 이름만 추출하기
        const fileName = filePath.split('/').pop();
        // 새로운 URL 형성
        const newUrl = `${baseUrl}/${fileName}`;
        console.log(newUrl);
        return newUrl;
        }

        const myUrl = latestResult && latestResult.latestResult.photo ? convertFilePathToUrl(latestResult.latestResult.photo) : '';
        const imageUrl = plantDetails && plantDetails.photo ? convertFilePathToUrl(plantDetails.photo) : '';

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

    return (
    <div className='mobile'>
        <div className='topBar'></div>
        <div className='greenTop'>
            AI 식물 판별 결과
        </div>
        <div className='body2'>
            <div className='flex'>
                <img className="greenBox" src={imageUrl} alt='Plant2' style={{ maxHeight: "150px", maxWidth: "150px", padding: "20px", marginTop: "20px" }} />
                <img className="greenBox" src={myUrl} alt='Plant' style={{ maxHeight: "150px", maxWidth: "150px", padding: "20px", marginTop: "20px" }} />
                </div>
                <div style={{position:"relative", bottom:"0px"}}>
                {plantDetails && plantDetails.name ? (
                    <div className="greenTitle">{plantDetails.name}</div>
                    ) : (
                        <div className="greenTitle">로딩중</div>
                    )}
            <div className='greenBox' style={{ height: "350px" }}>
            {plantDetails ? (
                <div className="whiteBox" style={{ width:"90%", maxHeight:"85%", fontSize:"15pt", overflowY:"auto", scrollbarColor:"gray", textAlign:"initial", padding:"20px", lineHeight: "1.5", boxSizing: "border-box"}}>
                    학명 : {plantDetails.scientific_name}<br/>
                    <div style={{height:"7px"}}></div>
                    물 주기 : {plantDetails.watering}<br/>
                    <div style={{height:"7px"}}></div>
                    광 요구도 : {plantDetails.light_demand}<br/>
                    <div style={{height:"7px"}}></div>
                    온도 : {plantDetails.temperature}<br/>
                    <div style={{height:"7px"}}></div>
                    습도 : {plantDetails.humidity}
                    <div style={{height:"7px"}}></div>
                    설명 : {plantDetails.description}
                </div>
                ) : (
                   <div>Loading...</div>
                )}
                </div>
                <div className="flex" style={{marginTop:"35px"}}>
                
                <button type="button" className='greenButton' 
                onClick={() => {
                    saveMyFlower2({ plantdata_ID: plantDetails.plantdata_ID, photo_ID: latestResult.latestResult.photo_ID, user_plant_ID: plantDetails.user_plant_ID, humidity: plantDetails.humidity, light_demand: plantDetails.light_demand, temperature: plantDetails.temperature, watering: plantDetails.watering});
                    sendFlowerNameToFlutter(plantDetails.name + ',' + userId.Id);
                }}
                style={{ width: "50%", height: "80px", fontSize: "20pt"}}>식물 변경</button>
                <button type="button" className='greyButton' onClick={() => navigate('/FindFlower')} style={{ width: "50%", height: "80px", fontSize: "20px"}}>식물이 틀렸어요.</button>
                </div>
            </div>
            </div>
    </div>
    );
}

export default AI2;
