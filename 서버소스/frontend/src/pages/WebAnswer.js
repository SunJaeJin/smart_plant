import React, { useEffect, useState } from 'react';
import Menu from '../components/Menu';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const WebAnswer = () => {
    const { id } = useParams(); // useParams 훅을 사용하여 URL 파라미터 접근
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 네비게이션 처리
    const [results, setResults] = useState([]);
    const [inquiry, setInquiry] = useState('');
    const [details, setDetails] = useState('');
    const handleDetails = (event) => setDetails(event.target.value);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://ceprj.gachon.ac.kr:60007/api/admin/all-inquiries');
            console.log(response.data);    
            setResults(response.data);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    // 컴포넌트가 마운트될 때 데이터 가져오기
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // 데이터가 로드된 후에, URL의 id와 일치하는 데이터 찾기
        // useParams로부터 받아온 id를 숫자로 변환
        console.log(id)
        const inquiryId = parseInt(id, 10);
        console.log(inquiryId)  
        const inquiry = results.find(result => result.inquiry_ID === inquiryId);
        if (inquiry) {
            console.log(`inquiry_ID ${id}의 정보:`, inquiry);
            setInquiry(inquiry);
        }
    }, [results, id]); // results와 id가 변경될 때마다 이 효과가 실행됩니다.
    

    const handleAnswer = async (details) => {   
        const admin_ID = 'plantadmin24107';
        try {
            // 서버에 보낼 객체
            const data = {
                details: details,
                admin_ID: admin_ID  
            };
            const response = await axios.post(`http://ceprj.gachon.ac.kr:60007/api/admin/inquiries/${id}/replies`, data);
            alert('답변 등록 성공.');
            navigate('/WebInquiry'); // navigate 함수 호출
        } catch (error) {
            console.error('답변 등록 실패:', error);
            alert(error);
        }
    };
    
    return (
        <div className="flex web">
            <Menu />
            <div className='contents' style={{position:"relative", bottom:"0px"}}>
                <div className='flex'>
                    <div className="darkTitle" style={{width:"300px", marginBottom:"10px"}}>
                        사용자 문의 답변
                    </div>
                    <button type="button" className='darkButton' style={{width:"200px", height:"70px", margin:"90px 0 0 870px"}}
                        onClick={() => handleAnswer(details)}>답변 전송</button>
                </div>
                <div className='greyBox' style={{width:"90%", margin:"10px 0 10px 30px"}}>문의 내역</div>
                <div className="border" style={{width:"88.5%", height:"250px", maxHeight:"400px", marginLeft:"30px", fontSize: "30px", textAlign:"left", textIndent:"20px", wordBreak:"break-all", padding:"10px", overflowY:"auto"}}>
                    문의 제목 : {inquiry.subject}<br/>
                    {inquiry.details}</div>
                <div>
                    <div className='greyBox' style={{width:"90%", margin:"10px 0 10px 30px"}}>문의 답변</div>
                    <textarea className='webInputText' type="text" value={details} onChange={handleDetails} placeholder='문의 답변을 입력하세요.' style={{margin:"0",height:"300px", width:"89%", resize:"none", fontSize:"20px", paddingTop:"20px", marginRight:"90px"}}></textarea>
                </div>
            </div>
        </div>
    );
};

export default WebAnswer;
