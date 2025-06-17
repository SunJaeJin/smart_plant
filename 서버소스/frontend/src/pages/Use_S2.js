import React from 'react';
import { useNavigate } from 'react-router-dom';

const Use_S2 = () => {
    const navigate = useNavigate();
    return (
        <div className='mobile'>
            <div className='greenTop'>
                이용 방법
            </div>
            <div style={{fontSize:"20px"}}>
                <div className='flex' style={{}}>
                    <div className='useNum'>Step 3</div>
                    <div className='useText'>식물 등록</div>
                </div>
                <div className='flex'>
                    <img src='/images/use2.png' alt="use1" style={{width:"65vw", height:"470px"}}/>
                    <div style={{textAlign:"left", width:"30vw", marginLeft:"7px", fontSize:"20px"}}>식물을 선택하거나<br/><br/>AI 식물 판별 버튼을 눌러<br/><br/>식물을 등록해 주세요.</div>
                </div>
                <div className='flex' style={{height:"120px"}}>
                    <div className='useNum' style={{marginBottom:"40px"}}>Step 4</div>
                    <div className='useText' style={{margin:"0", height:"85px", textAlign:"left", fontSize:"17px"}}>메뉴-스마트화단-모듈설정에서<br/>모듈을 조작하거나<br/>설정을 변경할 수 있습니다.</div>
                </div>
                <button type="button" className='greenButton' onClick={() => navigate('/Main')} style={{width:"100%", height:"80px", fontSize:"20pt", marginTop:"0px"}}>메인 화면으로</button>
            </div>
        </div>
   );
};

export default Use_S2;
