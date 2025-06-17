import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import axios from 'axios';

function WebFlowerList({ flowers, onCheckedItemsChange }) {
    
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
                    onCheckedItemsChange(newFlowers); // 상위 컴포넌트로 업데이트된 flowers 배열 전달
                    setCheckedState({}); // 체크 상태 초기화
                })
                .catch(error => {
                    console.error('삭제 중 오류가 발생했습니다:', error);
                });
        } else {
            console.log('삭제할 아이템이 없습니다.');
        }
    };

    return (
    <div>
        <ul style={{ listStyleType:"none", fontSize:"30px", display: "flex", flexWrap: "wrap", padding: 0, overflowY:"auto", scrollbarColor:"gray", maxHeight:"700px", margin:"auto", width:"90%" }}>
            {flowers && Array.isArray(flowers) && flowers.map((flower) => {
                const imageUrl = convertFilePathToUrl(flower.photo);
                return (
                // 각각의 리스트 항목(<li>)에 대한 스타일
                <li key={flower.plantdata_ID} style={{ width: '450px', boxSizing: 'border-box', padding: '10px', display:"flex", backgroundColor:"lightgrey", margin:"15px", borderRadius:"30px" }}>
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
        <button type="button" className='darkButton' onClick={handleDeleteCheckedItems} style={{width:"300px", height:"70px", margin:"50px 70px 30px 50px", position:"fixed", bottom:"792px", right:"300px"}}>선택한 데이터 삭제</button>
    </div>
    );
}

export default WebFlowerList;
