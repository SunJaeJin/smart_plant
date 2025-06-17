import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Find = () => {
    const navigate = useNavigate();
    const [emailForId, setEmailForId] = useState('');
    const [userIdForPassword, setUserIdForPassword] = useState('');
    const [emailForPassword, setEmailForPassword] = useState('');

    const handleFindId = async () => {
        try {
            const response = await axios.post('http://ceprj.gachon.ac.kr:60007/api/users/find_id', {
                email: emailForId
            });
            // 아이디 찾기 성공 처리
            alert(`회원님의 아이디는 ${response.data.user_ID} 입니다.`);
        } catch (error) {
            // 에러 처리
            console.error('아이디 찾기 실패:', error);
            alert('아이디 찾기에 실패했습니다.');
        }
    };

    const handleResetPasswordRequest = async () => {
        try {
            const response = await axios.post('http://ceprj.gachon.ac.kr:60007/api/users/validate-user', {
                user_ID: userIdForPassword,
                email: emailForPassword
            });

            if (response.status === 200) {
                // 사용자 검증 성공, 비밀번호 재설정 페이지로 이동
                navigate('/ResetPassword', { state: { user_ID: userIdForPassword, email: emailForPassword } });
            } else {
                alert('아이디와 이메일이 일치하지 않습니다.');
            }
        } catch (error) {
            console.error('검증 실패:', error);
            alert('검증에 실패했습니다.');
        }
    };

    return (
        <div className='mobile'>
            <div className='topBar'></div>
            <div className='greenTop'>
                ID / 비밀번호 찾기
            </div>
            <div className='body2'>
            <div style={{marginTop:"20px"}}>
            <div className='greenTitle'>아이디 찾기</div>
            <div className='greenBox' style={{height:"220px"}}>
                <div style={{marginTop:"10px"}}>
                    이메일<br/>
                    <input className='inputText' type="email" placeholder='Enter E-mail' value={emailForId} onChange={(e) => setEmailForId(e.target.value)}></input>
                </div>
                <button type="submit" className='greenButton' onClick={handleFindId} style={{width:"140px", height:"45px", marginTop:"20px"}}>아이디 확인</button>
            </div>
            </div>
            <div style={{marginTop:"20px"}}>
            <div className='greenTitle'>비밀번호 찾기</div>
            <div className='greenBox' style={{height:"290px"}}>
                <div style={{marginTop:"10px"}}>
                    아이디<br/>
                    <input className='inputText' type="text" placeholder='Enter ID' value={userIdForPassword} onChange={(e) => setUserIdForPassword(e.target.value)} />
                </div>
                <div style={{marginTop:"10px"}}>
                    이메일<br/>
                    <input className='inputText' type="email" placeholder='Enter E-mail' value={emailForPassword} onChange={(e) => setEmailForPassword(e.target.value)} />
                </div>
                <button type="submit" className='greenButton' onClick={handleResetPasswordRequest} style={{width:"150px", height:"45px", marginTop:"20px"}}>비밀번호 재설정</button>
            </div>
        </div>
        </div>
        </div>
    );
};

export default Find;
