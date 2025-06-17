import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Menu from '../components/Menu'

const WebFlowerInfo = () => {

    const [flower, setFlower] = useState({});
    const { plantdata_ID } = useParams(); // useParams 훅을 사용하여 URL 파라미터 접근
    const [result, setResult] = useState([]);

    useEffect(() => {
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/plantdata/plants/${plantdata_ID}`)
            .then(response => {
                setFlower(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, [plantdata_ID]); // id가 변경될 때마다 이 useEffect가 실행되어야 하므로, 의존성 배열에 id를 추가
    
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

    // 이미지 경로를 URL로 변환하기 전에 flower 객체와 photo 프로퍼티가 존재하는지 확인
    const imageUrl = flower && flower.photo ? convertFilePathToUrl(flower.photo) : '';

    return (
    <div className="flex web">
        <Menu />
    <div className='contents'>
            <div className="darkTitle" style={{width:"300px"}}>
                식물 상세 데이터
            </div>
        <div style={{}}>
        <div className="flex" style={{backgroundColor:"lightgrey", width:"90%", padding:"20px", border:"none", borderRadius:"20px", height:"70vh"}}>
            {/* 왼쪽 */}
            <div style={{width:"50%", margin:"auto", height:"100%"}}>
                <div style={{fontSize:"40px", textAlign:"left"}}>
                    식물 이미지
                </div>
                    <div style={{ marginTop: '20px' }}>
                    <img src={imageUrl} alt="Preview" style={{ width: '300px', maxHeight: '300px', borderRadius:"10px" }} />
                </div>
                <div>
                    <div style={{fontSize:"40px", textAlign:"left", marginTop:"50px"}}>
                    식물 이름 : {flower.name}
                    </div>
                </div>
                <div style={{marginTop:"30px"}}>
                    <div style={{fontSize:"40px", textAlign:"left"}}>
                    식물 학명 : {flower.scientific_name}
                    </div>
                </div>
                <div>
            </div>
            </div>
            {/* 오른쪽 */}
            <div style={{width:"50%", margin:"auto", height:"100%"}}>
            <div>
                <div style={{fontSize:"40px", textAlign:"left", marginTop:"50px"}}>
                물 주기 : {flower.watering}
                </div>
            </div>
            <div style={{marginTop:"30px"}}>
                <div style={{fontSize:"40px", textAlign:"left"}}>
                광요구도 : {flower.light_demand}
                </div>
            </div>
        <div style={{}}>    
            <div style={{margin:"30px 50px 0 0"}}>
                <div style={{fontSize:"40px", textAlign:"left"}}>
                적정 온도 : {flower.temperature}
                </div>
            </div>
            <div style={{marginTop:"30px"}}>
                <div style={{fontSize:"40px", textAlign:"left"}}>
                적정 습도 : {flower.humidity}
                </div>
            </div>
        </div>    
            <div style={{fontSize:"40px", textAlign:"left", marginTop:"30px"}}>
                식물 상세 정보 : <br/>
                <div style={{fontSize:"25px", border:"none", backgroundColor:"white", borderRadius:"20px", padding:"20px", lineHeight: "2", boxSizing: "border-box", marginTop:"10px", width:"90%", maxHeight:"270px", overflowY:"auto"}}>
                    {flower.description}</div>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
    );
};

export default WebFlowerInfo;