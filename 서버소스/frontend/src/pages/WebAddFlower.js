import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../components/Menu'

const WebAddFlower = () => {

    const navigate = useNavigate();
    const [flowerName, setFlowerName] = useState('');
    const [scientificName, setScientificName] = useState('');
    const [humidityRange, setHumidityRange] = useState('');
    const [lightIntensity, setLightIntensity] = useState('');
    const [tempRange, setTempRange] = useState('');
    const [wateringInterval, setWateringInterval] = useState('');
    const [description, setDescription] = useState('');

    const handleFlowerNameChange = (event) => setFlowerName(event.target.value);
    const handleScientificNameChange = (event) => setScientificName(event.target.value);
    const handleHumidityRangeChange = (event) => setHumidityRange(event.target.value);
    const handleLightIntensityChange = (event) => setLightIntensity(event.target.value);
    const handleTempRangeChange = (event) => setTempRange(event.target.value);
    const handleWateringIntervalChange = (event) => setWateringInterval(event.target.value);
    const handleDescriptionChange = (event) => setDescription(event.target.value);

    /*const handleAddFlower = async () => {

        try {
            const response = await axios.post('http://ceprj.gachon.ac.kr:60007/api/plantdata/plants', {
                name :flowerName,
                scientific_name: scientificName,
                description: description,
                watering: wateringInterval,
                temperature: tempRange,
                humidity: humidityRange,
                light_demand: lightIntensity
            });
            alert('식물 데이터가 추가되었습니다.');
        } catch (error) {
            console.error('식물 데이터 추가 실패', error);
            alert('식물 데이터 추가 실패');
        }
    };*/

    const handleAddFlower = async () => {
        const formData = new FormData();
        formData.append('photo', newFlowerImage); // 이미지 파일 추가
        formData.append('name', flowerName);
        formData.append('scientific_name', scientificName);
        formData.append('description', description);
        formData.append('watering', wateringInterval);
        formData.append('temperature', tempRange);
        formData.append('humidity', humidityRange);
        formData.append('light_demand', lightIntensity);
    
        try {
            const response = await axios.post('http://ceprj.gachon.ac.kr:60007/api/plantdata/plants', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('식물 데이터가 추가되었습니다.');
            navigate('/WebFlower2'); // 성공 후 리디렉트하거나 다른 액션 수행

        } catch (error) {
            console.error('식물 데이터 추가 실패', error);
            alert('식물 데이터 추가 실패');
        }
    };
    
    const [newFlowerImage, setNewFlowerImage] = useState();
    const [previewUrl, setPreviewUrl] = useState('/images/image.png');
    // 이미지 파일을 선택했을 때 호출될 핸들러 함수입니다.
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // 선택된 파일을 가져옵니다.
        if (file) {
        // FileReader API를 사용하여 파일을 읽습니다.
        const reader = new FileReader();
        reader.onloadend = () => {
            // 파일 읽기가 완료되면, 상태를 업데이트합니다.
            setNewFlowerImage(file);
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };


    return (
    <div className="flex web">
        <Menu />
    <div className='contents'>
            <div className='flex'>
                <div className="darkTitle" style={{width:"450px", margin:"0 20px"}}>
                    식물 데이터 추가
                </div>
                <button type="submit" className='darkButton' onClick={handleAddFlower} style={{ width:"220px", height:"80px", fontSize:"35px", margin:"50px 60px 15px 1010px"}}>추가하기</button>
            </div>
        <div style={{position:"relative", bottom:"0px"}}>
        <div className="flex" style={{backgroundColor:"lightgrey", width:"90%", padding:"20px", border:"none", borderRadius:"20px", height:"70%"}}>
            {/* 왼쪽 */}
            <div style={{width:"50%", margin:"auto", height:"100%"}}>
                {/* 이미지 선택 */}
                <div style={{fontSize:"30px", textAlign:"left"}}>
                    식물 이미지
                </div>
                    <input type="file" onChange={handleImageChange} style={{fontSize:"30px",marginTop:"20px"}}/>
                        <div style={{ marginTop: '20px' }}>
                        <img src={previewUrl} alt="Preview" style={{ width: '250px', maxHeight: '250px' }} />
                </div>
                <div>
                    <div style={{fontSize:"30px", textAlign:"left", marginTop:"50px"}}>
                    식물 이름
                    </div>
                    <input className='webInputText' type="text" value={flowerName} onChange={handleFlowerNameChange} placeholder='식물 이름을 입력하세요.' style={{fontSize:"20px", height:"60px"}}></input>
                </div>
                <div style={{marginTop:"30px"}}>
                    <div style={{fontSize:"30px", textAlign:"left"}}>
                    식물 학명
                    </div>
                    <input className='webInputText' type="text" value={scientificName} onChange={handleScientificNameChange} placeholder='식물 학명을 입력하세요.' style={{fontSize:"20px", height:"60px"}}></input>
                </div>
                <div>
            </div>
            </div>
            {/* 오른쪽 */}
            <div style={{width:"50%", margin:"auto", height:"100%"}}>
            <div>
                <div style={{fontSize:"30px", textAlign:"left", marginTop:"50px"}}>
                물 주기
                </div>
                <input className='webInputText' type="text" value={wateringInterval} onChange={handleWateringIntervalChange} placeholder='물 주기 입력하세요.' style={{fontSize:"20px", height:"60px"}}></input>
            </div>
            <div style={{marginTop:"30px"}}>
                <div style={{fontSize:"30px", textAlign:"left"}}>
                광요구도
                </div>
                <input className='webInputText' type="text" value={lightIntensity} onChange={handleLightIntensityChange} placeholder='광요구도를 입력하세요.' style={{fontSize:"20px", height:"60px"}}></input>
            </div>
        <div style={{display:"flex"}}>    
            <div style={{margin:"50px 50px 0 10px"}}>
                <div style={{fontSize:"30px", textAlign:"left"}}>
                온도
                </div>
                <input className='webInputText' type="text" value={tempRange} onChange={handleTempRangeChange} placeholder='적정 온도를 입력하세요.' style={{fontSize:"20px", height:"60px", width:"300px"}}></input>
            </div>
            <div style={{marginTop:"50px"}}>
                <div style={{fontSize:"30px", textAlign:"left"}}>
                습도
                </div>
                <input className='webInputText' type="text" value={humidityRange} onChange={handleHumidityRangeChange} placeholder='적정 습도를 입력하세요.' style={{fontSize:"20px", height:"60px", width:"300px"}}></input>
            </div>
        </div>    
                <div style={{fontSize:"30px", textAlign:"left", marginTop:"50px"}}>
                식물 상세 정보
                </div>
                <textarea className='webInputText' type="text" value={description} onChange={handleDescriptionChange} placeholder='식물 상세 정보를 입력하세요.' style={{height:"100px", width:"90%", resize:"none", fontSize:"20px", paddingTop:"20px"}}></textarea>
            </div>
        </div>
        </div>
    </div>
    </div>
    );
};

export default WebAddFlower;