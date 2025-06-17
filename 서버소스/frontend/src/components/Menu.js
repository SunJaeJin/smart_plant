import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Menu () {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 로그아웃 요청을 서버에 보냅니다.
            await axios.post('http://ceprj.gachon.ac.kr:60007/api/admin/logout');
            // 로그아웃이 성공적이면 홈페이지로 리다이렉트합니다.
            navigate('/');
        } catch (error) {
            console.error('로그아웃 실패:', error);
            alert('로그아웃에 실패했습니다.');
        }
    };

    return (
        <div className="menuBox">
            <button type="button" className='menuButton' onClick={() => navigate('/WebMain')} style={{marginTop:"20px"}}>
                <div className='flex' style={{justifyContent:"center"}}>
                    <img src="/images/Home2.png" alt="메인 화면"  style={{width:"50px", marginRight:"20px"}} />
                    <div>메인 화면</div>
                </div>
            </button>
            <button type="button" className='menuButton' onClick={() => navigate('/WebInquiry')} >
                <div className='flex' style={{justifyContent:"center"}}>
                    <img src="/images/question2.png" alt="문의 내역"  style={{width:"50px", marginRight:"20px"}} />
                    <div>문의 내역</div>
                </div>
            </button>
            <button type="button" className='menuButton' onClick={() => navigate('/WebUser')} >
                <div className='flex' style={{justifyContent:"center"}}>
                    <img src="/images/users.png" alt="사용자 목록"  style={{width:"50px", marginRight:"12px"}} />
                    <div style={{fontSize:"27px"}}>사용자 목록</div>
                </div>
            </button>
            <button type="button" className='menuButton' onClick={() => navigate('/WebDevice2')} >
                <div className='flex' style={{justifyContent:"center"}}>
                    <img src="/images/iot.png" alt="디바이스 목록"  style={{width:"50px", marginRight:"12px"}} />
                    <div style={{fontSize:"23px"}}>디바이스 목록</div>
                </div>
            </button>
            <button type="button" className='menuButton' onClick={() => navigate('/WebAI')} >
                <div className='flex' style={{justifyContent:"center", position:"relative", left:"-10px"}}>
                    <img src="/images/ai2.png" alt="AI 관리"  style={{width:"50px", marginRight:"20px"}} />
                    <div>AI 관리</div>
                </div>
            </button>
            <button type="button" className='menuButton' onClick={() => navigate('/WebFlower2')} >
                <div className='flex' style={{justifyContent:"center"}}>
                    <img src="/images/plant.png" alt="식물 관리"  style={{width:"50px", marginRight:"20px"}} />
                    <div>식물 관리</div>
                </div>
            </button>
            {/* <button type="button" className='menuButton' onClick={() => navigate('/WebManager')} >관리자<br/>정보변경</button> */}
            <button type="button" className='menuButton' onClick={handleLogout} >
                <div className='flex' style={{justifyContent:"center"}}>
                    <img src="/images/logout.png" alt="로그 아웃"  style={{width:"50px", marginRight:"20px"}} />
                    <div>로그 아웃</div>
                </div>
            </button>
        </div>
    );
};

export default Menu;