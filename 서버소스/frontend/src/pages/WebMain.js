import React from 'react';
import Menu from '../components/Menu';

const WebMain = () => {

    return (
        <div className="flex web" style={{width:"100vw", height:"100vh"}}>
            <Menu />
                <div className='contents'>
                    <div style={{width:"600px", margin:"40px 0px 0px 20px"}}>
                        <div style={{fontSize:"100px", fontWeight:"bold", textAlign:"right"}}>
                            자연 지능 화단
                        </div>
                        <div style={{fontSize:"60px", fontWeight:"bold", textAlign:"right"}}>
                            관리자 모드
                        </div>
                    </div>
                    <img src="/images/grey.png" alt="메인 로고"  style={{width:"900px", position:"fixed", right:"65px", bottom:"70px"}}/>
                </div>
        </div>
    );
};

export default WebMain;
