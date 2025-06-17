import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://ceprj.gachon.ac.kr:60007');

const Login = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false); // rememberMe 상태 추가

    useEffect(() => {
        // 컴포넌트 마운트 시 로그인 상태 확인
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://ceprj.gachon.ac.kr:60007/api/users/check-login');
                if (response.data.loggedIn) {
                    navigate('/Device');
                }
            } catch (error) {
                console.error('로그인 상태 확인 실패:', error);
            }
        };

        checkLoginStatus();
    }, [navigate]);

    const handleUserIdChange = (event) => {
        setUserId(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRememberMeChange = (event) => {
        setRememberMe(event.target.checked);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://ceprj.gachon.ac.kr:60007/api/users/login', {
                user_ID: userId,
                password: password,
                rememberMe: rememberMe // rememberMe 값 전송
            });
            socket.emit('register', userId);
            // 로그인 성공 시, /Device로 리다이렉트
            navigate('/Device');
        } catch (error) {
            // 에러 처리
            console.error('로그인 실패:', error);
            alert('로그인에 실패했습니다.');
        }
    };

    return (
        <div className='mobile greenBack2'>
            <img src="/images/newArt.png" alt="자연 지능 화단 로고" style={{marginBottom:"15px", border:"none", borderRadius:"50px", width:"200px"}} 
                // 임시로 아이콘 클릭시 메인 화면으로 이동
                onClick={() => navigate('/Main')}/>
            <div className='whiteBox green3' style={{fontSize:"40px", fontWeight:"bold", width:"300px", height:"70px"}}>
                자연 지능 화단
            </div>
            <div style={{marginTop:"15px"}}>
                <div>
                    아이디<br/>
                    <input className='inputText' type="text" placeholder='Enter ID' style={{width:"170px", color:"black"}} value={userId} onChange={handleUserIdChange}></input>
                </div>
                <div>
                    비밀번호<br/>
                    <input className='inputText' type="password" placeholder='Enter Password' style={{width:"170px", color:"black"}} value={password} onChange={handlePasswordChange}></input>
                </div>
                <div>
                    <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} style={{scale:"1.5", marginRight:"5px", accentColor:"#255652"}}/> 자동 로그인
                </div>
            </div>
            <div>
                <button type="button" className='greenButton' onClick={handleSubmit}>로그인</button>
            </div>
            <div>
                <button type="button" className='greenButton2' onClick={() => navigate('/Register')} style={{marginRight:"20px"}}>회원 가입</button>
                <button type="button" className='greenButton2' onClick={() => navigate('/Find')}>ID / PW 찾기</button>
            </div>
            <button type="button" className='greyButton' onClick={() => navigate('/Use')}
            style={{width:"280px"}}>이용 방법</button>
        </div>
    );
};

export default Login;