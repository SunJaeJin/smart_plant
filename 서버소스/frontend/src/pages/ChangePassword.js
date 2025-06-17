import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleCurrentPasswordChange = (event) => {
        setCurrentPassword(event.target.value);
    };

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('http://ceprj.gachon.ac.kr:60007/api/users/change-password', {
                currentPassword, // 현재 비밀번호 추가
                newPassword
            });
            alert('비밀번호가 성공적으로 변경되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('비밀번호 변경 실패:', error);
            alert('비밀번호 변경에 실패했습니다.');
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
                    현재 비밀번호<br/>
                    <input className='inputText' type="password" value={currentPassword} onChange={handleCurrentPasswordChange} placeholder='Enter Current Password'></input>
                </div>
                <div style={{marginTop:"20px"}}>
                    새 비밀번호<br/>
                    <input className='inputText' type="password" value={newPassword} onChange={handleNewPasswordChange} placeholder='Enter New Password'></input>
                </div>
                <div style={{marginTop:"20px"}}>
                    새 비밀번호 확인<br/>
                    <input className='inputText' type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder='Enter New Password Again'></input>
                </div>
                <button type="submit" className='greenButton' onClick={handleChangePassword} style={{width:"100px", height:"45px", marginTop:"30px"}}>변경</button>
            </div>
        </div>
    );
};

export default ChangePassword;
