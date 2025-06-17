import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function UserList() {
    const [result, setResult] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 5; // 페이지 당 표시할 항목 수

    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/admin/users')
            .then(response => {
                console.log(response.data); 
                setResult(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []); // 컴포넌트 마운트시 데이터 로드

    const indexOfLastItem = currentPage * PAGE_SIZE;
    const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
    const currentItems = result.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지에서 표시할 아이템
    const totalPage = Math.ceil(result.length / PAGE_SIZE); // 총 페이지 수

    const pages = [...Array(totalPage).keys()].map(n => n + 1); // 페이지 번호 배열

    function goToPage(pageNumber) {
        setCurrentPage(pageNumber);
    }

    const extractT = (datetimeString) => {
        const newBirth = datetimeString.split('T')[0];
        return newBirth;
    };

    return (
    <div>
        <ul style={{listStyleType: "none", fontSize: "20px", width: "85%", maxHeight: "650px", overflowY: "auto", margin:"auto"}}>
            {currentItems.map((user) => ( // currentItems로 수정
            <li key={user.loginID}>
                <Link className="linkBorder" to={`/WebUserInfo/${user.user_ID}`}
                    style={{ borderCollapse:"collapse", marginLeft:"30px", width:"90%", textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', backgroundColor:"white", fontSize:"32px"}}>
                    <div className="userContent">{user.user_ID}</div>
                    <div className="userContent">{user.name}</div>
                    <div className="userContent">{extractT(user.birth)}</div>
                    <div className="userContent">{user.device_ID ? user.device_ID : 'None'}</div>
                    <div className="userContent" style={{marginRight:"0px"}}>{user.status}</div>
                </Link>
            </li>
            ))}
        </ul>
        <div>
        {pages.map(page => (
            <button key={page} onClick={() => goToPage(page)} disabled={currentPage === page} style={{fontSize:"40px", marginTop:"100px"}}>
                {page}
            </button>
        ))}
        </div>
    </div>
    );
}

export default UserList;
