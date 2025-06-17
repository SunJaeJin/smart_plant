import React, { useEffect, useState, version } from 'react';
import axios from 'axios';
import userData from '../userData';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function AIList() {
    const [result, setResult] = useState([]);
    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/ai/ai_models')
            .then(response => {
                console.log(response.data); 
                setResult(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []); // 컴포넌트 마운트시 데이터 로드

    const selectModel = (version) => {
        // 사용자에게 모델 사용 확인을 요청
        const isConfirmed = window.confirm('선택한 모델을 사용하시겠습니까?');
        if (isConfirmed) {
            // axios.put 메소드를 사용해 서버로 요청을 보냄
            axios.put('http://ceprj.gachon.ac.kr:60007/api/ai/current_ai_version', {
                version: version // 서버에 전달할 데이터
            })
            .then(response => {
                // 요청이 성공적으로 처리되었을 때 실행될 코드
                console.log('서버 응답:', response);
                alert('모델 변경이 완료되었습니다..'); // 사용자에게 성공 알림
                window.location.reload(); // 페이지 새로고침
            })
            .catch(error => {
                // 요청 처리 중 오류가 발생했을 때 실행될 코드
                console.error('오류 발생:', error);
            });
            console.log(version);
        }
    };

    return (
    <div style={{position:"relative", right:"40px"}}>
        <ul style={{listStyleType: "none", fontSize: "10px", width: "100%", maxHeight: "30vh", overflowY: "auto", margin:"auto"}}>
            {result.map((ai) => (
            <li key={ai.model_ID}>
                {/* 링크로 수정후 눌렀을때 모델 선택 예 아니오 */}
                <Link className="linkBorder" onClick={() => selectModel(ai.version)}
                    style={{ borderCollapse:"collapse", marginLeft:"0px", width:"100%", textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', backgroundColor:"white", fontSize:"20px"}}>
                    <div className="userContent" style={{width:"190px", marginRight:"0px"}}>{ai.model_ID}</div>
                    <div className="userContent" style={{width:"300px", marginRight:"0"}}>{ai.version}</div>
                    <div className="userContent" style={{width:"270px", marginRight:"0"}}> {new Date(ai.training_date).toLocaleDateString('en-CA')}</div>
                    <div className="userContent" style={{width:"120px", marginRight:"0"}}>{ai.accuracy}</div>
                    <div className="userContent" style={{width:"300px", marginRight:"0px"}}>{ai.description}</div>
                </Link>
            </li>
            ))}
        </ul>
    </div>
    );
}

export default AIList;
