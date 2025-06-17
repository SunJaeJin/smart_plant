import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WebLogin = () => {
    const navigate = useNavigate();
    const [adminID, setAdminID] = useState(''); // 아이디 상태
    const [password, setPassword] = useState(''); // 비밀번호 상태

    useEffect(() => {
        // 컴포넌트 마운트 시 로그인 상태 확인
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://ceprj.gachon.ac.kr:60007/api/admin/check-login');
                if (response.data.loggedIn) {
                    navigate('/WebMain');
                }
            } catch (error) {
                console.error('로그인 상태 확인 실패:', error);
            }
        };

        checkLoginStatus();
    }, [navigate]);

    const handleAdminIdChange = (event) => {
        setAdminID(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://ceprj.gachon.ac.kr:60007/api/admin/login', {
                admin_ID: adminID,
                password: password
            });
            if (response.data.success) {
                // 로그인 성공 시, /WebMain으로 리다이렉트
                console.log('Redirecting to WebMain...');
                navigate('/WebMain');
            } else {
                // 로그인 실패에 대한 사용자 피드백
                alert(response.data.message || '로그인에 실패했습니다.');
            }
        } catch (error) {
            // 네트워크 에러 또는 서버 오류 처리
            console.error('로그인 실패:', error);
            alert('로그인에 실패했습니다.');
        }
    };

    return (
        <div className='web webGreenBack'>
            <div>
            {/* 타이틀 */}
            <div className='flex zeroMargin'>
                <img src="/images/newArt.png" alt="자연 지능 화단 로고"  style={{float:"left", width:"250px", margin:"50px", marginRight:"0px", borderRadius:"50px"}}/>
                <div style={{width:"550px"}}>
                    <div className='green4' style={{fontSize:"90px", fontWeight:"bold", textAlign:"right"}}>
                        자연 지능 화단
                    </div>
                    <div style={{fontSize:"50px", fontWeight:"bold", textAlign:"right"}}>
                        관리자 로그인
                    </div>
                </div>
            </div>
            {/* 로그인 */}
            <div className="" style={{width:"600px", marginLeft:"120px"}}>
                <div className='label' style={{marginTop:"0px"}}>
                    아이디<br/>
                    <input className='webInputText' type="text" placeholder='Enter ID' value={adminID} onChange={handleAdminIdChange} style={{}}></input>
                </div>
                <div className='label'  style={{marginTop:"50px"}}>
                    비밀번호<br/>
                    <input className='webInputText' type="password" placeholder='Enter Password' value={password} onChange={handlePasswordChange} style={{}}></input>
                </div>
                <button type="button" className='webGreenButton' onClick={handleSubmit} style={{margin:"auto", marginTop:"50px"}}>로그인</button>
            </div>
            </div>
            <img src="/images/login.png" alt="로그인 로고"  style={{width:"870px", position:"fixed", right:"50px", bottom:"70px"}}/>
        </div>
    );
};

export default WebLogin;