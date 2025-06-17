import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Withdraw = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleUserIdChange = (event) => {
        setUserId(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    function sendInitToFlutter(Init) {
        if (window.sendInitSetting) {
            window.sendInitSetting.postMessage(Init);
        } else {
            console.error('객체를 찾을 수 없음');
        }
    }
    const handleWithdraw = async () => {
        try {
            const response = await axios.delete('http://ceprj.gachon.ac.kr:60007/api/users/delete-account', {
                data: {
                    user_ID: userId,
                    password: password
                }
            });
            if (response.status === 200) {
                alert('회원탈퇴 처리가 완료되었습니다.');
                navigate('/'); // 탈퇴 성공 후 홈으로 리다이렉션
            }
        } catch (error) {
            console.error('회원탈퇴 실패:', error);
            alert('회원탈퇴 처리에 실패했습니다.');
        }
    };

    return (
        <div className='greenBack mobile'>
            <div className='topBar'></div>
            <div className='greenTop'>
                회원 탈퇴
            </div>
            <div className='body2'>
            <div className='whiteBox marginI' style={{width:"300px", height:"150px", fontSize:"30px", marginTop:"20px !important"}}>
                자연 지능 화단을<br/>이용해주셔서<br/>감사합니다
            </div>
            <div style={{marginTop:"20px"}}>
                아이디<br/>
                <input className='inputText' type="text" value={userId} onChange={handleUserIdChange} placeholder='Enter ID'></input>
            </div>
            <div  style={{marginTop:"20px"}}>
                비밀번호<br/>
                <input className='inputText' type="password" value={password} onChange={handlePasswordChange} placeholder='Enter Password'></input>
            </div>
            <button type="submit" className='greenButton' onClick={()=>{sendInitToFlutter("Init"); handleWithdraw();}} style={{width:"100px", height:"45px", marginTop:"30px"}}>탈퇴</button>
            </div>
        </div>
    );
};

export default Withdraw;