import React from 'react';
import { useNavigate } from 'react-router-dom';

const Use = () => {
    const navigate = useNavigate();
    return (
        <div className='mobile'>
            <div className='greenTop'>
                이용 방법
            </div>
            <div style={{fontSize:"20px"}}>
                <div className='flex' style={{}}>
                    <div className='useNum'>Step 1</div>
                    <div className='useText'>회원 가입하기</div>
                </div>
                <div className='flex'>
                    <div className='useNum'>Step 2</div>
                    <div className='useText'>기기 등록하기</div>
                </div>
                <div className='flex'>
                    <img src='/images/use1.png' alt="use1" style={{width:"275px", height:"500px"}}/>
                    <div style={{textAlign:"left", width:"100px", marginLeft:"7px", fontSize:"20px"}}>검색버튼을 눌러 기기를 검색하고<br/><br/>디바이스를 선택하여 등록해 주세요.<br/><br/>초기 이름은 SMARTPOT입니다.</div>
                </div>
                <button type="button" className='greenButton' onClick={() => navigate('/Use2')} style={{width:"100%", height:"80px", fontSize:"20pt", marginTop:"10px"}}>다음</button>
            </div>
        </div>
   );
};

export default Use;
