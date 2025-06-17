import React, { useEffect, useState } from 'react';
import Menu from '../components/Menu'
import { Link } from 'react-router-dom';
import axios from 'axios';

const WebUser = () => {

    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [initialResults, setInitialResults] = useState([]); // 초기 데이터 상태
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 7; // 페이지 당 표시할 항목 수

    // 검색어가 변경될 때마다 이 함수를 실행합니다.
    useEffect(() => {
        handleSearch();
    }, [searchTerm]);

    // 검색 함수
    const handleSearch = () => {
        const filteredResults = initialResults.filter(result =>
            result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.user_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (result.device_ID && result.device_ID.toLowerCase().includes(searchTerm.toLowerCase()))||
            (result.birth && result.birth.split('T')[0].includes(searchTerm))
        );
        setResults(filteredResults); // 검색 결과를 상태에 설정
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://ceprj.gachon.ac.kr:60007/api/admin/users');
                setInitialResults(response.data); // 초기 데이터 설정을 올바르게 수정
                setResults(response.data); // 검색되지 않은 상태에서 모든 데이터를 표시하기 위해 설정
                console.log(results);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    // 컴포넌트가 마운트될 때 데이터 가져오기
    useEffect(() => {
        fetchData();
    }, []);

    const indexOfLastItem = currentPage * PAGE_SIZE;
    const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
    const currentItems = results.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지에서 표시할 아이템
    const totalPage = Math.ceil(results.length / PAGE_SIZE); // 총 페이지 수

    const pages = [...Array(totalPage).keys()].map(n => n + 1); // 페이지 번호 배열

    function goToPage(pageNumber) {
        setCurrentPage(pageNumber);
    }

    const extractT = (datetimeString) => {
        const newBirth = datetimeString.split('T')[0];
        return newBirth;
    };

    return (
        <div className="flex web">
            <Menu />
                <div className='contents'>
                    <div className="darkTitle">
                        사용자 목록
                    </div>
                    <form className='webSearch' style={{margin:"auto", width:"78%"}}>
                    <input 
                        style={{width:"97.5%", height:"60%", border:"none", borderRadius:"10px", paddingLeft:"10px", fontFamily:"main_font", fontSize:"30px"}}
                        type="text"
                        placeholder="검색하기"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* <button style={{width:"10%", height:"100%", fontFamily:"main_font", fontSize:"30px", marginLeft:"20px"}} type="submit">검색</button> */}
                    </form>
                    <div className='flex'>
                        <div className='greyBox' style={{margin:"10px 40px 10px 170px"}}>아이디</div>
                        <div className='greyBox' style={{marginRight:"40px"}}>이름</div>
                        <div className='greyBox' style={{marginRight:"40px"}}>생년월일</div>
                        <div className='greyBox' style={{marginRight:"40px"}}>디바이스 ID</div>
                        <div className='greyBox' style={{marginRight:"0px"}}>계정 상태</div>
                    </div>
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
                        <button key={page} onClick={() => goToPage(page)} disabled={currentPage === page} style={{fontSize:"40px", marginTop:"50px"}}>
                            {page}
                        </button>
                    ))}
                    </div>
                </div>
                </div>
            </div>
    );
};

export default WebUser;