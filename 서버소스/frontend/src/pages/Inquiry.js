import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar.js';
import DetailButtons from '../components/DetailButtons.js';

const Inquiry = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [details, setDetails] = useState('');

// userId 불러오기
const [userId, setUserId] = useState([]);
useEffect(() => {
    axios.get(`http://ceprj.gachon.ac.kr:60007/api/users/id-info`)
    .then(response => {
        setUserId(response.data); // 서버로부터 받은 데이터를 state에 저장
        console.log(response.data)
    })
    .catch(error => console.log(error));
}, []); // 컴포넌트가 마운트될 때 요청을 보냄

const handleSubject = (event) => {
    setSubject(event.target.value);
};

const handleDetails = (event) => {
    setDetails(event.target.value);
};

const handleInquiry = async (user_ID, subject, details) => {
    try {
        // 서버에 보낼 객체
        const data = {
            user_ID: user_ID,
            subject: subject,
            details: details
        };
        const response = await axios.post('http://ceprj.gachon.ac.kr:60007/api/users/inquiries', data);
        alert('문의 등록 성공.');
        navigate('/InquiryList');
    } catch (error) {
        console.error('문의 등록 실패:', error);
        alert(error);
    }
};

return (
    <div className='mobile'>
        <div className='topBar'></div>
        <div className='greenTop flex' style={{textAlign:"left", textIndent:"10px", width:"100%", justifyContent:"space-between"}}>
        <div>문의 하기</div>
        <div><Sidebar/></div>
    </div>
        <div className='body'>
        <div style={{textAlign:"left", fontSize:"25px"}}>
            <div style={{margin:"20px 0 0px 20px", height:"10px"}}>문의 제목</div><br/>
            <input className='inputText' type="text" value={subject} onChange={handleSubject} placeholder='제목을 입력해 주세요.'
            style={{width:"90%", height:"40px", margin:"0 0 0 15px"}}></input>
        </div>
        <div style={{textAlign:"left", fontSize:"25px"}}>
        <div style={{margin:"20px 0 0px 20px", height:"10px"}}>문의 내용</div><br/>
            <textarea className='inputText' type="text" value={details} onChange={handleDetails} placeholder='문의 내용을 입력해주세요.'
            style={{width:"90%", height:"350px", margin:"0 0 0 15px", resize:"none", paddingTop:"20px"}}></textarea>
        </div>
        
         <button type="button" className='greenButton' style={{width:"120px", height:"50px", marginTop:"10px"}}
                onClick={() => handleInquiry(userId.Id, subject, details)}>문의 전송</button>
        </div>
        <DetailButtons />
    </div>
);
};

export default Inquiry;