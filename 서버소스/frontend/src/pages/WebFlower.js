import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../components/Menu';
import axios from 'axios';
import WebFlowerList from '../components/WebFlowerList';

const WebFlower = () => {
    const navigate = useNavigate();
    const [initialFlowers, setInitialFlowers] = useState([]); // 초기 꽃 데이터 상태
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [flowers, setFlowers] = useState([]); // 식물 데이터 상태

    // 검색어가 변경될 때마다 이 함수를 실행합니다.
    useEffect(() => {
        handleSearch();
    }, [searchTerm]);

    // 검색 함수
    const handleSearch = () => {
        const filteredFlowers = initialFlowers.filter(flower =>
            flower.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFlowers(filteredFlowers); // 검색 결과를 상태에 설정
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://ceprj.gachon.ac.kr:60007/api/plantdata/plants');
                setInitialFlowers(response.data); // 초기 데이터 설정을 올바르게 수정
                setFlowers(response.data); // 검색되지 않은 상태에서 모든 꽃 데이터를 표시하기 위해 설정
                console.log(flowers);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    // 컴포넌트가 마운트될 때 데이터 가져오기
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex web">
            <Menu />
            <div className='flex'>
                <div className='contents'>
                <div style={{display:"flex"}}>
                    <div className="darkTitle" style={{margin:"10px 930px 0 10px", width:"330px"}}>
                        식물 데이터 관리
                    </div>
                    <button type="button" className='darkButton' onClick={() => navigate('/WebAddFlower')} style={{width:"250px", height:"70px", margin:"30px"}}>식물 데이터 추가</button>
                    </div>
                    <form className='webSearch' style={{margin:"auto"}}>
                        <input 
                            style={{width:"97.5%", height:"60%", border:"none", borderRadius:"10px", paddingLeft:"10px", fontFamily:"main_font", fontSize:"30px"}}
                            type="text"
                            placeholder="검색하기"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* <button style={{width:"10%", height:"100%", fontFamily:"main_font", fontSize:"30px", marginLeft:"20px"}} type="submit">검색</button> */}
                    </form>
                    <WebFlowerList flowers={flowers}/>
                </div>
            </div>
        </div>
    );
};

export default WebFlower;
