import React, {useEffect, useState} from 'react';
import '../App.css';
import Sidebar from '../components/Sidebar.js';
import DetailButtons from '../components/DetailButtons.js';
import FlowerList2 from '../components/FlowerList2.js';
import axios from 'axios';

function SupportFlower() {

    
    const [initialFlowers, setInitialFlowers] = useState([]); // 초기 꽃 데이터 상태
    const [flowers, setFlowers] = useState([]); // 검색 결과 꽃 데이터 상태
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태

    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/plantdata/plants')
            .then(response => {
                setInitialFlowers(response.data); // 초기 데이터 설정을 올바르게 수정
                setFlowers(response.data); // 검색되지 않은 상태에서 모든 꽃 데이터를 표시하기 위해 설정
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

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

    return (
    <div className="mobile">
        <div className='topBar'></div>
        {/* 페이지 타이틀 */}
        <div className='greenTop flex' style={{textAlign:"left", textIndent:"10px", justifyContent:"space-between"}}>      
            <div style={{}}>지원 식물 정보</div>
            <div><Sidebar /></div>
        </div>
        {/* 페이지 내용 */}
        <div className='body'>
            <form className='search' onSubmit={(e) => {
                e.preventDefault(); // 기본 동작 방지
                handleSearch(); // 검색 함수 호출
            }}>
                <input style ={{width:"92%", height:"70%", border:"none", borderRadius:"10px", paddingLeft:"10px", fontFamily:"main_font", margin:"auto"}}
                    type="text"
                    placeholder="검색하기"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* <button style ={{width:"20%", height:"100%", fontFamily:"main_font"}} type="submit">검색</button> */}
            </form>
            <FlowerList2 flowers={flowers} />
        </div>
        {/* 하단 버튼 */}
        <DetailButtons />
    </div>
    );
}

export default SupportFlower;
