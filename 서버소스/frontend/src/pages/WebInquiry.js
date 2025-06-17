import React, { useEffect, useState } from 'react';
import Menu from '../components/Menu'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WebInquiry = () => {
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10; // 페이지 당 표시할 항목 수

    const fetchData = async () => {
        try {
            const response = await axios.get('http://ceprj.gachon.ac.kr:60007/api/admin/all-inquiries');
                console.log(response.data)    
                // 가져온 데이터 중에서 status가 "pending"인 데이터만 필터링합니다.
                const pendingData = response.data.filter(item => item.status === "pending");
                // 필터링된 데이터를 상태에 저장합니다.
                setResults(pendingData);
                // 필터링된 데이터를 콘솔에 출력합니다.
            console.log(pendingData);
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

    function convertDateFormat(datetime) {
        // 날짜와 시간을 'YYYY-MM-DD HH:MM:SS' 형식으로 파싱합니다.
        const date = new Date(datetime);
      
        // 각 부분을 추출하여 포매팅합니다.
        const year = date.getFullYear().toString().slice(-2); // 년도의 마지막 두 자리
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // 월 (0을 추가하여 두 자리수 유지)
        const day = ('0' + date.getDate()).slice(-2); // 일 (0을 추가하여 두 자리수 유지)
        const hours = ('0' + date.getHours()).slice(-2); // 시 (0을 추가하여 두 자리수 유지)
        const minutes = ('0' + date.getMinutes()).slice(-2); // 분 (0을 추가하여 두 자리수 유지)
        const seconds = ('0' + date.getSeconds()).slice(-2); // 초 (0을 추가하여 두 자리수 유지)
      
        // 'YY-MM-DD HH:MM:SS' 형식으로 병합하여 반환합니다.
        return `${year}-${month}-${day}`;
      }

      const handleAnswer = (id) => {
        navigate(`/WebAnswer/${id}`);
    };

    return (
        <div className="flex web">
            <Menu />
                <div className='contents' style={{position:"relative", bottom:"30px"}}>
                    <div className="darkTitle" style={{width:"300px", marginBottom:"10px"}}>
                        사용자 문의 내역
                    </div>
                    <div className='flex'>
                        <div className='greyBox' style={{margin:"10px 20px 10px 160px"}}>문의 날짜</div>
                        <div className='greyBox' style={{marginRight:"20px"}}>회원 ID</div>
                        <div className='greyBox' style={{marginRight:"10px", width:"570px"}}>문의 제목</div>
                        <div className='greyBox' style={{marginRight:"0px", width:"150px"}}>문의 답변</div>
                    </div>
                    <div>
                         <ul style={{listStyleType: "none", fontSize: "20px", width: "85%", maxHeight: "650px", overflowY: "auto", margin:"auto"}}>
                            {currentItems.map((result) => ( // currentItems로 수정
                            <li key={result.inquiry_ID}>
                                <div className="linkBorder" to={``}
                                    style={{ borderCollapse:"collapse", marginLeft:"30px", width:"90%", textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', backgroundColor:"white", fontSize:"32px"}}>
                                    <div className="userContent">{convertDateFormat(result.timestamp)}</div>
                                    <div className="userContent">{result.user_ID}</div>
                                    <div className="userContent" style={{width:"580px", overflow:"hidden"}}>{result.subject}</div>
                                    <button className='deviceButton' style={{width:"150px"}} onClick={() => handleAnswer(result.inquiry_ID)}>문의 답변</button>
                                </div>

                                {/* <div className="linkBorder" to={``}
                                    style={{ borderCollapse:"collapse", marginLeft:"30px", width:"90%", textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', backgroundColor:"white", fontSize:"32px"}}>
                                    <div className="userContent">24-05-19</div>
                                    <div className="userContent">test21431</div>
                                    <div className="userContent border" style={{width:"580px", overflow:"hidden"}}>adsfasdfdasfdsfdasㅁㅇㄴㄹㅁㅇㄴㄹㅁㅇㄴㄹㅇㅁㄴㄹㅁㅇㄴㄹㅁㅇㄴㄹㅁㄴㅇㄹㅁㅇㄴ</div>
                                    <button className='deviceButton' style={{width:"150px"}} onClick={() => handleAnswer()}>문의 답변</button>
                                </div> */}

                                {/* <div className='greyBox' style={{width:"90%", margin:"10px 0 10px 30px"}}>문의 내역</div> */}
                                {/* <div className="userContent border" style={{width:"90%", height:"400px", maxHeight:"400px",overflowY:"auto", marginLeft:"30px", fontSize: "30px"}}>{result.details}</div> */}
                            </li>
                            ))}
                        </ul>
                    <div>
                    {pages.map(page => (
                        <button key={page} onClick={() => goToPage(page)} disabled={currentPage === page} style={{fontSize:"40px", marginTop:"15px"}}>
                            {page}
                        </button>
                    ))}
                    </div>
                </div>
                </div>
            </div>
    );
};

export default WebInquiry;