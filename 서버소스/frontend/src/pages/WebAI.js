import React, { useEffect, useState } from 'react';
import Menu from '../components/Menu'
import { useNavigate } from 'react-router-dom';
import AIList from '../components/AIList';
import AIChart from '../components/AIChart';
import AIChart2 from '../components/AIChart2';
import AITrain from '../components/AITrain';
import axios from 'axios';

const WebAI = () => {
    const navigate = useNavigate();

    const [result, setResult] = useState([]);

    // http://ceprj.gachon.ac.kr:60007/api/ai/current_ai_version
    useEffect(() => {
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/ai/current_ai_version`)
            .then(response => {
                console.log(response.data);
                setResult(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    return (
        <div className="flex web">
            <Menu />  
        <div className='contents'>
            <div className='flex' style={{justifyContent:"space-between"}}>
                <div className="darkTitle" style={{fontSize:"25px", width:"450px", height:"60px", margin:"10px"}}>
                    현재 AI 모델 : {result}
                </div>
                <button type="button" className='darkButton' onClick={() => navigate('/WebAIAdd')} style={{width:"150px", height:"50px", fontSize:"20px", marginRight:"50px"}}>데이터셋 추가</button>
            </div>
        <div className='flex' style={{width:"80vw", height:"44vh", justifyContent:"space-between", marginBottom:"10px" }}>
            {/* 데이터셋 분포 */}
            <div className="border"style={{width:"40vw", height:"100%", margin:"10px"}}>
                <div className='greyBox' style={{fontSize:"20px", width:"150px", height:"50px"}}>데이터셋 분포</div>
                <div style={{width:"90%", height:"100%", marginLeft:"20px"}}>
                    <AIChart />
                </div>
            </div>
            {/* 모델별 성능 */}
            <div className="border" style={{width:"40vw", height:"100%", margin:"10px", overflow: "auto"}}>
                <div className='greyBox' style={{fontSize:"20px", width:"150px", height:"50px"}}>모델별 성능</div>
                <div style={{width:"90%", height:"85%", marginLeft:"30px"}}>
                    <AIChart2 />
                </div>
            </div>
        </div>
        <div className='flex' style={{width:"80vw", height:"44vh", justifyContent:"space-between"}}>
            {/* 모델 선택 */}
            <div className="border"style={{width:"40vw", height:"100%", margin:"10px"}}>
                <div className='flex' style={{justifyContent:"space-between"}}>
                    <div className='greyBox' style={{fontSize:"20px", width:"200px", height:"50px"}}>식물 인식 모델 선택</div>
                </div>
                <div className='flex' style={{width:"38vw"}}>
                    <div className='' style={{margin:"10px 0px 10px 0px", fontSize:"15px", width:"190px"}}>모델 ID</div>
                    <div className='' style={{marginRight:"0px", fontSize:"15px", width:"270px"}}>모델 버전</div>
                    <div className='' style={{marginRight:"0px", fontSize:"15px", width:"270px"}}>학습 일자</div>
                    <div className='' style={{marginRight:"0px", fontSize:"15px", width:"120px"}}>인식 정확도</div>
                    <div className='' style={{marginRight:"25px", fontSize:"15px", width:"300px"}}>설명</div>
                </div>
                <div style={{width:"38vw"}}>
                <AIList />
                </div>
            </div>
            {/* 모델 학습 */}
            <div className="border" style={{width:"40vw", height:"100%", margin:"10px", overflow: "auto"}}>
                <div className='greyBox' style={{fontSize:"20px", width:"150px", height:"50px"}}>모델 학습</div>
                <div style={{marginTop:"10px"}}>
                <AITrain />            
                </div>
            </div>
        </div>
        </div>
        </div>
    );
};

export default WebAI;