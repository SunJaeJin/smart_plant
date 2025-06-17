import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';
import Sidebar from '../components/Sidebar.js';
import DetailButtons from '../components/DetailButtons.js';
import axios from 'axios';

function FlowerDetail() {
    
    const [flower, setFlower] = useState(null);
    const { plantdata_ID } = useParams(); // useParams 훅을 사용하여 URL 파라미터 접근

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
        <div className="mobile">
        <div className='topBar'></div>
        {/* 페이지 타이틀 */}
        <div className='greenTop flex' style={{textAlign:"left", textIndent:"10px", justifyContent:"space-between"}}>      
            <div style={{}}>지원 식물 상세 정보</div>
            <div><Sidebar /></div>
        </div>
        {/* 페이지 내용 */}
        <div className='body'>
            <img className="greenBox" src={imageUrl} alt={flower.name} style={{ maxHeight: "200px", maxWidth: "200px", padding: "15px", marginTop: "20px", position:"relative", top:'10px' }} />
            <div className="greenTitle">{flower.name}</div>
            <div className='greenBox' style={{ height: "290px" }}>
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
        </div>
        {/* 하단 버튼 */}
        <DetailButtons />
    </div>
    );
}

export default FlowerDetail;
