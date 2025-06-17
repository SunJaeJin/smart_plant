import React from 'react';
import { useNavigate } from 'react-router-dom';

const WebFirst = () => {
    const navigate = useNavigate();
    
    return (
        <div className='web webGreenBack'>
            <div>
            {/* 타이틀 */}
            <div className='flex zeroMargin'>
                <img src="/images/newArt.png" alt="자연 지능 화단 로고"  style={{float:"left", width:"250px", margin:"50px", marginRight:"0px", borderRadius:"50px"}}/>
                <div style={{width:"700px",marginLeft:"30px"}}>
                <div style={{fontSize:"50px", fontWeight:"bold", textAlign:"right", marginBottom:"20px"}}>
                        스마트하게 키우는 나만의 작은 정원
                    </div>
                    <div className='green4 whiteBox' style={{fontSize:"90px", fontWeight:"bold", textAlign:"center", width:"80%", float:"left"}}>
                        자연 지능 화단
                    </div>
                </div>
            </div>
            {/* 로그인 */}
            <div className="" style={{width:"730px", marginLeft:"120px"}}>
                <div className='first' style={{marginTop:"0px", width:"480px"}}>
                    App을 통해서 누구나 쉽게!<br/>
                </div>
                <div className='first'  style={{marginTop:"50px", width:"580px"}}>
                    자동 관리 시스템으로 더 편리하게!
                </div>
                <div className='first'  style={{marginTop:"50px"}}>
                    AI 식물 판별 기술을 이용해 더 간단하게!
                </div>
                <a href="/AI_FlowerPot.apk" download style={{ textDecoration: 'none' }}>
                    <button type="button" className='webGreenButton' style={{margin:"50px 20px 0 0"}}>
                        App<br/>다운로드
                    </button>
                </a>
                <button type="button" className='webGreenButton' onClick={() => navigate('/WebLogin')} style={{margin:"auto", marginTop:"50px",backgroundColor:"grey"}}>관리자<br/>페이지</button>
            </div>
            </div>
            <img src="/images/login.png" alt="로그인 로고"  style={{width:"870px", position:"fixed", right:"50px", bottom:"70px"}}/>
        </div>
    );
};

export default WebFirst;
