import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../components/Menu'

const WebManager = () => {

    const navigate = useNavigate();
    const [newID, setNewID] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleNewIDChange = (event) => {
        setNewID(event.target.value);
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
            const response = await axios.post('http://ceprj.gachon.ac.kr:60007/api/', {
                newID,
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
        <div className="flex web">
            <Menu />
            <div className='flex'>
                <div className='contents'>
                        <div className="darkTitle" style={{width:"300px"}}>
                            관리자 정보 변경
                        </div>
            <div style={{width:"600px", margin:"auto"}}>
            <div style={{marginTop:"50px"}}>
                <div style={{fontSize:"50px", textAlign:"left"}}>
                새 아이디
                </div>
                <input className='webInputText' type="password" value={newID} onChange={handleNewIDChange} placeholder='Enter New ID'></input>
            </div>
            <div style={{marginTop:"50px"}}>
                <div style={{fontSize:"50px", textAlign:"left"}}>
                새 비밀번호
                </div>
                <input className='webInputText' type="password" value={newPassword} onChange={handleNewPasswordChange} placeholder='Enter New Password'></input>
            </div>
            <div style={{marginTop:"50px"}}>
                <div style={{fontSize:"50px", textAlign:"left"}}>
                새 비밀번호 확인
                </div>
                <input className='webInputText' type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder='Enter New Password Again'></input>
            </div>
            <button type="submit" className='darkButton' onClick={handleChangePassword} style={{width:"250px", height:"90px", fontSize:"40px", margin:"50px 0 0 60px"}}>저장하기</button>
            </div>
                </div>
            </div>
        </div>
    );
};

export default WebManager;