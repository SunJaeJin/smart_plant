import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar.js';
import DetailButtons from '../components/DetailButtons.js';
import { PiStarFill, PiStarLight } from "react-icons/pi";

const Survey = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(3);
    const [rating2, setRating2] = useState(3);
    const [rating3, setRating3] = useState(3);

    const [details, setDetails] = useState();

const handleDetails = (event) => {
    setDetails(event.target.value);
};

const handleSurvey = async (details, rating, rating2, rating3) => {
    try {
        const data = {
            ai_score : rating,
            service_score : rating2,
            app_score : rating3,
            feedback : details
        };
        await axios.post('http://ceprj.gachon.ac.kr:60007/api/users/satisfaction-survey', data);
        alert('소중한 의견 감사합니다.');
        navigate('/Main');
    } catch (error) {
        console.error('제출 실패:', error);
        alert(error);
    }
};

return (
    <div className='mobile'>
        <div className='topBar'></div>
        <div className='greenTop flex' style={{textAlign:"left", textIndent:"10px", width:"100%", justifyContent:"space-between"}}>
        <div>만족도 조사</div>
        <div><Sidebar/></div>
    </div>
        <div className='body'>
        <div className='greenBox flex' style={{height:"65px", fontSize:"17pt", padding:"5px 7px 5px 0px",  boxSizing: "border-box", marginTop:"20px"}}>
            <div className="whiteBox" style={{ width:"40%", height:"85%"}}>
                AI 정확도
            </div>
            <div style={{margin:"4px 35px 0 20px", scale:"1.4", color:"#255652"}}>
                {[...Array(rating)].map((a, i) => (
                    <PiStarFill className="star-lg" key={i} onClick={() => setRating(i + 1)} />
                ))}
                {[...Array(5 - rating)].map((a, i) => (
                    <PiStarLight className="star-lg" key={i} onClick={() => setRating(rating + i + 1)} />
                ))}
            </div>
        </div>

        <div className='greenBox flex' style={{height:"65px", fontSize:"17pt", padding:"5px 7px 5px 0px",  boxSizing: "border-box", marginTop:"20px"}}>
            <div className="whiteBox" style={{ width:"40%", height:"85%", fontSize:"18px"}}>
                자동 관리 서비스
            </div>
            <div style={{margin:"4px 35px 0 20px", scale:"1.4", color:"#255652"}}>
                {[...Array(rating2)].map((a, i) => (
                    <PiStarFill className="star-lg" key={i} onClick={() => setRating2(i + 1)} />
                ))}
                {[...Array(5 - rating2)].map((a, i) => (
                    <PiStarLight className="star-lg" key={i} onClick={() => setRating2(rating2 + i + 1)} />
                ))}
            </div>
        </div>

        <div className='greenBox flex' style={{height:"65px", fontSize:"17pt", padding:"5px 7px 5px 0px",  boxSizing: "border-box", marginTop:"20px"}}>
            <div className="whiteBox" style={{ width:"40%", height:"85%"}}>
                어플 디자인
            </div>
            <div style={{margin:"4px 35px 0 20px", scale:"1.4", color:"#255652"}}>
                {[...Array(rating3)].map((a, i) => (
                    <PiStarFill className="star-lg" key={i} onClick={() => setRating3(i + 1)} />
                ))}
                {[...Array(5 - rating3)].map((a, i) => (
                    <PiStarLight className="star-lg" key={i} onClick={() => setRating3(rating3 + i + 1)} />
                ))}
            </div>
        </div>

        <div style={{textAlign:"left", fontSize:"25px"}}>
        <div style={{margin:"20px 0 0px 20px", height:"10px"}}>건의 사항</div><br/>
            <textarea className='inputText' type="text" value={details} onChange={handleDetails} placeholder='추가 건의 사항을 입력해주세요.'
            style={{width:"90%", height:"200px", margin:"0 0 0 15px", resize:"none", paddingTop:"20px"}}></textarea>
        </div>
        
         <button type="button" className='greenButton' style={{width:"120px", height:"50px", marginTop:"10px"}}
                onClick={() => handleSurvey(details, rating, rating2, rating3)}>제출</button>
        </div>
        <DetailButtons />
    </div>
);
};

export default Survey;