import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import Menu from '../components/Menu';
import axios from 'axios';

const WebFlower2 = () => {
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


    // 리스트 부분
    const [checkedState, setCheckedState] = useState({});

    function convertFilePathToUrl(filePath) {
        const baseUrl = "http://ceprj.gachon.ac.kr:60007";
        if (!filePath) {  // filePath가 undefined 또는 빈 문자열인 경우
            return `${baseUrl}/defaultImage.png`;  // 기본 이미지 URL을 반환
        }
        const fileName = filePath.split('/').pop();
        const newUrl = `${baseUrl}/${fileName}`;
        return newUrl;
    }

    // 체크박스 상태를 업데이트하고 콘솔에 로그하는 함수
    const handleCheckboxChange = (plantdata_ID) => {
        setCheckedState(prevState => {
            const newState = {
            ...prevState,
            [plantdata_ID]: !prevState[plantdata_ID]
            };
            console.log(newState);
            return newState;
        });
    };

    const handleDeleteCheckedItems = () => {
        const checkedIds = Object.entries(checkedState).reduce((acc, [id, isChecked]) => {
            if(isChecked) acc.push(id);
            return acc;
        }, []);
    
        if (checkedIds.length > 0) {
            console.log('삭제할 아이템 ID:', checkedIds);
            const deletePromises = checkedIds.map(id => {
                // 여기에 axios.delete 요청 추가
                return axios.delete(`http://ceprj.gachon.ac.kr:60007/api/plantdata/plants/${id}`);
            });
    
            Promise.all(deletePromises)
                .then(() => {
                    console.log('모든 선택된 항목들이 성공적으로 삭제되었습니다.');
                    // 체크된 아이템을 제외한 새로운 flowers 배열 생성
                    const newFlowers = flowers.filter(flower => !checkedIds.includes(flower.plantdata_ID.toString()));
                    // onCheckedItemsChange(newFlowers); // 상위 컴포넌트로 업데이트된 flowers 배열 전달
                    setCheckedState({}); // 체크 상태 초기화
                    alert('모든 선택된 항목들이 성공적으로 삭제되었습니다.')
                    window.location.reload(); // 페이지 새로고침
                })
                .catch(error => {
                    console.error('삭제 중 오류가 발생했습니다:', error);
                });
        } else {
            console.log('삭제할 아이템이 없습니다.');
        }
    };

    return (
        <div className="flex web">
            <Menu />
            <div className='flex'>
                <div className='contents'>
                <div style={{display:"flex"}}>
                    <div className="darkTitle" style={{margin:"10px 630px 0 10px", width:"330px"}}>
                        식물 데이터 관리
                    </div>
                    <button type="button" className='darkButton' onClick={handleDeleteCheckedItems} style={{width:"300px", height:"70px", margin:"30px 0px 30px 0px"}}>선택한 데이터 삭제</button>
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
                    <div>
                        <ul style={{ listStyleType:"none", fontSize:"30px", display: "flex", flexWrap: "wrap", padding: 0, overflowY:"auto", scrollbarColor:"gray", maxHeight:"700px", margin:"auto", width:"90%" }}>
                            {flowers && Array.isArray(flowers) && flowers.map((flower) => {
                                const imageUrl = convertFilePathToUrl(flower.photo);
                                return (
                                // 각각의 리스트 항목(<li>)에 대한 스타일
                                <li key={flower.plantdata_ID} style={{ width: '420px', boxSizing: 'border-box', padding: '10px', display:"flex", backgroundColor:"lightgrey", margin:"15px", borderRadius:"30px" }}>
                                    <input type="checkbox" 
                                        checked={checkedState[flower.plantdata_ID] ?? false}
                                        onChange={() => handleCheckboxChange(flower.plantdata_ID)} style={{ margin: '0 30px 0 20px', transform:"scale(2)" }} />
                                    <Link to={`/WebFlowerInfo/${flower.plantdata_ID}`} style={{textDecoration: 'none', display: 'flex', alignItems: 'center', width:"100%" }}>
                                        <div style={{ textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center' }}>
                                        <img src={imageUrl} alt={flower.name} style={{ width: "100px", height: "100px", marginRight: '30px', float: 'left', padding: "5px", borderRadius:"20px" }} />
                                        <div>{flower.name}</div>
                                        </div>
                                    </Link>
                                </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebFlower2;
