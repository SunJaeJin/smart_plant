import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar.js';
import DetailButtons from '../components/DetailButtons.js';

const InquiryList = () => {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);  // 초기 상태를 빈 배열로 설정

    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/users/user-inquiries')
            .then(response => {
                console.log(response.data);
                setInquiries(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

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
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }

    return (
        <div className='mobile'>
            <div className='topBar'></div>
            <div className='greenTop flex' style={{ textAlign: "left", textIndent: "10px", width: "100%", justifyContent: "space-between" }}>
                <div>문의 내역</div>
                <div><Sidebar /></div>
            </div>
            <div className='body'>
                    <ul style={{ listStyleType: "none", fontSize: "20px", width: "100%", maxHeight: "590px", overflowY: "auto", margin: "auto", position:"relative", right:"20px", marginTop:"20px" }}>
                    {inquiries.map((inquiry) => (
                        <li key={inquiry.inquiry_ID} style={{marginBottom:"20px"}}>
                            <div className='flex'>
                                <div className='greenTop2' style={{borderBottom:"none", borderRight:"none"}}>문의 날짜</div>
                                <div className='whiteBox2' style={{borderBottom:"none", borderLeft:"none"}}>{convertDateFormat(inquiry.timestamp)}</div>
                            </div>
                            <div className='flex'>
                                <div className='greenTop2'style={{borderBottom:"none", borderRight:"none"}}>문의 제목</div>
                                <div className='whiteBox2'style={{borderBottom:"none", borderLeft:"none"}}>{inquiry.subject}</div>
                            </div>
                            <div className='whiteBox2' style={{height:"150px", width:"350px", overflowY: "auto"}}>{inquiry.details}</div>
                            <div>
                            {inquiry.reply_details === null ? (
                                <div className='whiteBox2' style={{border:"1px solid #9E9E9E", width:"350px", color:"white", backgroundColor:"#9E9E9E" }}>문의 답변 대기중..</div>
                            ) : (
                                <div className='whiteBox2' style={{height:"150px", width:"350px", overflowY: "auto", borderTop:"none", alignContent:"normal"}}>
                                <div className='greenTop2'style={{border:"none"}}>문의 답변</div>
                                {inquiry.reply_details}</div>
                            )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <DetailButtons />
        </div>
    );
};

export default InquiryList;
