import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // useLocation import 추가
import axios from 'axios';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();  // useLocation을 사용하여 location 객체 접근
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // location.state에서 user_ID와 email을 가져옴
    const { user_ID, email } = location.state || {};  // location.state가 undefined일 수 있으므로 기본값 설정

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('http://ceprj.gachon.ac.kr:60007/api/users/reset-password', {
                user_ID,
                email,
                newPassword
            });
            alert('비밀번호가 성공적으로 재설정되었습니다.');
            navigate('/');  // 로그인 페이지나 메인 페이지로 이동
        } catch (error) {
            console.error('비밀번호 재설정 실패:', error);
            alert('비밀번호 재설정에 실패했습니다.');
        }
    };

    return (
        <div className='mobile greenBack'>
            <div className='topBar'></div>
            <div className='greenTop'>
                비밀번호 변경
            </div>
            <div className='body2'>
            <div className='whiteBox marginI' style={{width:"300px", height:"150px", fontSize:"30px", marginTop:"20px !important"}}>
                변경할 비밀번호를<br/>입력해주세요.
            </div>
            <div style={{marginTop:"20px"}}>
                새 비밀번호<br/>
                <input className='inputText' type="password" value={newPassword} onChange={handleNewPasswordChange} placeholder='Enter New Password'></input>
            </div>
            <div style={{marginTop:"20px"}}>
                새 비밀번호 확인<br/>
                <input className='inputText' type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder='Enter New Password Again'></input>
            </div>
            <button type="submit" className='greenButton' onClick={handleResetPassword} style={{width:"100px", height:"45px", marginTop:"30px"}}>변경</button>
            </div>
        </div>
    );
};

export default ResetPassword;
