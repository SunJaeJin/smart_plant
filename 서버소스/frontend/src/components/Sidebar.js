import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import Hamburger from 'hamburger-react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://ceprj.gachon.ac.kr:60007');
function Sidebar () {
    const navigate = useNavigate();
    const [isOpen, setOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [pumpNotifications, setPumpNotifications] = useState([]);
    const [waterNotifications, setWaterNotifications] = useState([]);
    const [inquiryNotifications, setInquiryNotifications] = useState([]);
    
    useEffect(() => {
      axios.get(`http://ceprj.gachon.ac.kr:60007/api/users/id-info`)
        .then(response => {
            setUserId(response.data); 
            console.log(response.data);
        })
        .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (userId !== null) {  
          console.log('Setting up socket listener for userId:', userId);
    
          socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
          });
    
          socket.on('disconnect', () => {
            console.log('Socket disconnected');
          });
    
          const alertEvent = 'new-alert' + userId.Id; 
          socket.on(alertEvent, (data) => {
            console.log('New alert received:', data.message);
            if(data.type==="Pump"){
                window.Pump.postMessage(data.message);
            }else if(data.type==="water"){
                window.water.postMessage(data.message);
            }
    
            const newNotification = {
              message: data.message,
              type: data.type,
              date: new Date().toISOString()
            };
    
            if (newNotification.type === 'Pump') {
                setPumpNotifications((prevNotifications) => [...prevNotifications, newNotification]);
            } else if (newNotification.type === 'water') {
                setWaterNotifications((prevNotifications) => [...prevNotifications, newNotification]);
            } else if (newNotification.type === 'inquiry_reply') {
                setInquiryNotifications((prevNotifications) => [...prevNotifications, newNotification]);
            }
          });
    
          return () => {
            console.log('Cleaning up socket listener for userId:', userId);
            socket.off(alertEvent);  
          };
        }
      }, [userId]);

    // 각 드롭다운 메뉴 항목의 상태를 관리하는 객체
    const [dropdownStates, setDropdownStates] = useState({});
    // 드롭다운 메뉴 항목의 열림/닫힘 상태를 토글하는 함수
    const toggleDropdown = (item) => {
    setDropdownStates(prevState => ({
        ...prevState,
        [item]: !prevState[item]
    }));
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://ceprj.gachon.ac.kr:60007/api/users/logout');
            // 서버 응답을 확인하고 클라이언트 측에서 페이지를 전환합니다.
            console.log(response.data.message);
            navigate('/'); // 홈으로 리다이렉트
        } catch (error) {
            console.error('로그아웃 실패:', error);
            alert('로그아웃에 실패했습니다.');
        }
    };

     // isOpen 상태가 변경될 때마다 실행됩니다.
    useEffect(() => {
    if (isOpen) {
        // isOpen이 true일 때 원하는 로직을 추가할 수 있습니다.
    } else {
        setDropdownStates({});
    }}, [isOpen]);

    const [plant, setPlant] = useState([]);
    const [device, setDevice] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/users/main-page-data')
            .then(response => {
                console.log(response.data);
                setDevice(response.data.devices[0]);
                setPlant(response.data.plants[0]);
                setUnreadNotifications(response.data.unreadNotifications);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const [result, setResult] = useState([]);
    useEffect(() => {
        axios.get('http://ceprj.gachon.ac.kr:60007/api/users/notifications')
          .then(response => {
            // 'Pump' 타입의 알림만 필터링
            const pumpNotifications = response.data[0].filter(notification => notification.type === 'Pump');
            // 필터링된 결과를 콘솔에 출력
            console.log(pumpNotifications);
            // 필요한 경우 상태에 저장
            setResult(pumpNotifications);
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
      }, []);

    return(
    <div className='flex'>
    {/* <div className='border' style={{width:"100px", height:"50px", alignContent:"center"}}>알림 {result.length}</div> */}
    <div className='flex' style={{ height:"640px", zIndex:"1000", width:"50px"}}>
        <div style={{zIndex:"2000"}}>
            <Hamburger size={25} direction="left" toggled={isOpen} toggle={setOpen}/> 
        </div>
        <div className={isOpen ? "show-menu" : "hide-menu"}>
        <div className={isOpen ? "show-menu2" : "hide-menu2"} style={{width:"440px"}}></div>
        <div className='greenTop' style={{width:"250px", float:"right", fontSize:"20px",}}>
            사용자 메뉴</div>
        <div style={{backgroundColor:"white", width:'250px',height:"720px", float:"right", marginTop:"0px", fontSize:"20px", overflowY:"auto", scrollbarColor:"gray"}}>
            <div className='menuTitle flex' onClick={() => navigate('/Alarm')} style={{borderTop:"1.5px solid #255652"}}>
                <div style={{marginRight:"7px"}}>알림 센터</div>
                {/* <div className='flex border' style={{position:"relative", right:"42px", bottom:"7px", width:"100px"}}> */}
                    {/* <img src="/images/alarm3.png" alt="alarm"  style={{width:"25px"}} /> */}
                    {unreadNotifications > 0 &&
                    <div style={{textIndent:"0px", fontSize:"20px", color:"white", width:"50px", height:"30px", alignContent:"center", backgroundColor:"#255652", borderRadius:"10px", textAlign:"center"}}>
                        {unreadNotifications}
                    </div>
                    }
                {/* </div> */}
                {/* <div>{unreadNotifications > 0 && `(${unreadNotifications})`}</div> */}
            </div>
            {/* 스마트 화단 */}
            <div onClick={() => toggleDropdown('smart')} className='menuTitle'>스마트 화단</div>
                {dropdownStates['smart'] && (
                    <div style={{background: 'white', zIndex: '1000', color:"grey"}}>
                        <div onClick={() => navigate('/Module')} className="menuItem">
                            - 모듈 설정</div>
                        <div onClick={() => navigate(`/DeviceInfo/${device.device_ID}`)} className="menuItem">
                            - 디바이스 상세 정보</div>
                        <div onClick={() => navigate(`/DeviceName/${device.device_ID}`)} className="menuItem">
                            - 디바이스명 변경</div>
                        <div onClick={() => navigate('/ChangePlant')} className="menuItem">
                            - 나의 식물 변경</div>
                        <div onClick={() => navigate(`/DeleteDevice/${device.device_ID}`)} className="menuItem" style={{borderBottom:"1.5px solid #255652"}}>
                            - 디바이스 삭제</div>
                    </div>
                )}

            {/* 서비스 정보 */}
            <div onClick={() => toggleDropdown('service')} className='menuTitle'>서비스 정보</div>
                {dropdownStates['service'] && (
                    <div style={{background: 'white', zIndex: '1000', color:"grey"}}>
                        <div onClick={() => navigate('/SupportFlower')} className="menuItem">
                            - 지원 식물 정보</div>
                        <div onClick={() => navigate('/Use_S')} className="menuItem" style={{borderBottom:"1.5px solid #255652"}}>
                            - 이용 방법</div>
                    </div>
                )}

            {/* 마이페이지 */}
            <div onClick={() => toggleDropdown('mypage')} className='menuTitle'>마이페이지</div>
                {dropdownStates['mypage'] && (
                    <div style={{background: 'white', zIndex: '1000', color:"grey"}}>
                        <div onClick={() => navigate('/ChangePassword')} className="menuItem">
                            - 비밀번호 변경</div>
                        <div onClick={handleLogout} className="menuItem">
                            - 로그 아웃</div>
                        <div onClick={() => navigate('/Withdraw')} className="menuItem" style={{borderBottom:"1.5px solid #255652"}}>
                            - 회원 탈퇴</div>
                    </div>
                )}
            {/* 고객센터 */}
            <div onClick={() => toggleDropdown('cs')} className='menuTitle'>고객 센터</div>
                {dropdownStates['cs'] && (
                    <div style={{background: 'white', zIndex: '1000', color:"grey"}}>
                        <div onClick={() => navigate('/InquiryList')} className="menuItem">
                            - 문의 내역</div>
                        <div onClick={() => navigate('/Inquiry')} className="menuItem">
                            - 문의 하기</div>
                        <div onClick={() => navigate('/Survey')} className="menuItem" style={{borderBottom:"1.5px solid #255652"}}>
                            - 만족도 조사</div>
                    </div>
                )}
        </div>
        </div>
    </div>
    </div>
    );
}
export default Sidebar;
