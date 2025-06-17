import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function FlowerList({ flowers }) {
    // 이미지 경로를 URL로 변환하는 함수
    function convertFilePathToUrl(filePath) {
        const baseUrl = "http://ceprj.gachon.ac.kr:60007";
        const fileName = filePath.split('/').pop();
        const newUrl = `${baseUrl}/${fileName}`;
        
        return newUrl;
    }

    return (
        <ul style={{ listStyleType:"none", fontSize:"20px", width:"95%", maxHeight:"550px", overflowY:"auto", scrollbarColor:"gray", position:"relative", right:"27px"}}>
            {flowers && Array.isArray(flowers) && flowers.map((flower) => {
                const imageUrl = flower && flower.photo ? convertFilePathToUrl(flower.photo) : '';
                return (
                    <li key={flower.id}>
                        <Link to={`/FlowerInfo2/${flower.plantdata_ID}`}  style={{ textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', backgroundColor:"white", border:"1px solid lightgrey", borderRadius:"5px", marginBottom:"5px", marginRight:"5px"}}>
                            <img src={imageUrl} alt={flower.name} style={{ width: "60px", height: "60px", marginRight: '15px', float: 'left', padding:"5px", borderRadius:"10px"}} />
                            <div>{flower.name}</div>
                        </Link>
                    </li>
                )
            })}
        </ul>
    );
}

export default FlowerList;
