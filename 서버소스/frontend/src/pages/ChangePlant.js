import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePlant = () => {
    const navigate = useNavigate();
    const [plants, setPlants] = useState([]);

    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/users/main-page-data')
            .then(response => {
                console.log(response.data)
                setPlants(response.data.plants[0]);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    // 이미지 경로를 URL로 변환하는 함수
    function convertFilePathToUrl(filePath) {
        const baseUrl = "http://ceprj.gachon.ac.kr:60007";
        const fileName = filePath.split('/').pop();
        const newUrl = `${baseUrl}/${fileName}`;
        
        return newUrl;
    }

    const imageUrl = plants.device_photo ? convertFilePathToUrl(plants.device_photo) : '';
    const imageUrl2 = plants.default_photo ? convertFilePathToUrl(plants.default_photo) : '';

    return (
        <div className='greenBack mobile'>
        <div className='topBar'></div>
            <div className='greenTop' style={{width:"100%"}}>
                나의 식물 변경
            </div>
        <div className='body2'>
        {
                plants.name ? (
                  <img
                    className="greenBox"
                    src={imageUrl || imageUrl2} // imageUrl이 없을 경우 기본 이미지 URL을 사용
                    alt={plants.name}
                    style={{
                      height: "220px",
                      maxWidth: "220px",
                      padding: "15px",
                      marginTop: "20px",
                    }}
                  />
                ) : (
                  <div className='greenBox'                     
                    style={{
                      height: "220px",
                      maxWidth: "220px",
                      padding: "15px",
                      marginTop: "20px",
                      fontSize:"25px"
                  }}>로딩중...</div>
                )
              }
            <div style={{position:"relative", bottom:"30px"}}>
            <div className="greenTitle" style={{position:"relative", top:"55px"}}>{plants.name}</div>

            <div className='whiteBox marginI' style={{width:"300px", height:"250px", fontSize:"25px", marginTop:"20px !important"}}>
                현재 등록된 식물을<br/>변경하시겠습니까?
            </div>
            <div>
                <button type="button" className='greenButton' onClick={() => navigate('/FindFlower2')} style={{width:"100px", height:"55px", marginRight:"20px", marginTop:"30px"}}>예</button>
                <button type="button" className='greyButton' onClick={() => navigate('/Main')} style={{width:"100px", height:"55px", fontSize:"20px", marginTop:"30px"}}>아니오</button>
            </div>
            </div>
            </div>
        </div>
    );
};

export default ChangePlant;