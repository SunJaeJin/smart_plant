 import React, { useEffect, useState } from 'react';
import '../App.css';
import Sidebar from '../components/Sidebar.js';
import DetailButtons from '../components/DetailButtons.js';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://ceprj.gachon.ac.kr:60007');

function Alarm2() {
  const [notifications, setNotifications] = useState([]);
  const [result, setResult] = useState([]);

  // userId 불러오기
  const [userId, setUserId] = useState([]);
  useEffect(() => {
      axios.get(`http://ceprj.gachon.ac.kr:60007/api/users/id-info`)
      .then(response => {
          setUserId(response.data); // 서버로부터 받은 데이터를 state에 저장
          console.log(response.data)
      })
      .catch(error => console.log(error));
  }, []); // 컴포넌트가 마운트될 때 요청을 보냄

  useEffect(() => {
    if (userId !== null) {  // userId가 null이 아닐 때만 실행
      console.log('Setting up socket listener for userId:', userId);

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      // 서버로부터 알림을 받습니다.
      const alertEvent = 'new-alert' + userId.Id; // 이벤트 이름을 동적으로 생성
      socket.on(alertEvent, (data) => {
        console.log('New alert received:', data.message);
        alert(data.message);
        window.location.reload();
        const newNotification = {
          message: data.message
        };
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
      });

      return () => {
        console.log('Cleaning up socket listener for userId:', userId);
        socket.off(alertEvent);  // 동적으로 생성한 이벤트 이름을 사용하여 리스너 제거
      };
    }
  }, [userId]); // userId가 변경될 때마다 실행

  useEffect(() => {
    axios.get('http://ceprj.gachon.ac.kr:60007/api/users/notifications')
      .then(response => {
        console.log(response.data);
        // 'Pump' 타입의 알림만 필터링
        const pumpNotifications = response.data[0].filter(notification => notification.type === 'Pump');
        const waterNotifications = response.data[0].filter(notifications => notifications.type === 'water');
        
        // 필터링된 결과를 콘솔에 출력
        console.log(pumpNotifications);
        
        // 필요한 경우 상태에 저장
        setResult(pumpNotifications);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  // 알림 삭제 DELETE 라우터
  // http://ceprj.gachon.ac.kr:60007/api/users/notifications/:alertId
  // http://ceprj.gachon.ac.kr:60007/api/users/notifications/read/:alertId

  const handleDelete = async (alertId) => {
    try {
        // const response = await axios.delete(`http://ceprj.gachon.ac.kr:60007/api/users/notifications/${alertId}`, {
        const response = await axios.patch(`http://ceprj.gachon.ac.kr:60007/api/users/notifications/read/${alertId}`, {
        });
        if (response.status === 200) {
          console.log('삭제 성공');
          window.location.reload(); // 페이지 새로고침
        } else {
          console.error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        // 에러 응답의 내용을 더 자세히 출력
        if (error.response) {
            console.error('삭제 실패:', error.response.data);
            console.error('상태 코드:', error.response.status);
            console.error('헤더:', error.response.headers);
        } else if (error.request) {
            console.error('요청이 이루어졌으나 응답을 받지 못했습니다:', error.request);
        } else {
            console.error('요청 설정 중 에러가 발생했습니다:', error.message);
        }
    }
};

  // 알람 전체 삭제 기능
  const handleDeleteAll = async () => {
    try {
        const response = await axios.delete(`http://ceprj.gachon.ac.kr:60007/api/users/notifications`, {

      });
        if (response.status === 200) {
          console.log('전체 삭제 성공');
          setResult([]); // UI 상의 알람 목록도 초기화
        } else {
          console.error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        // 에러 핸들링 코드
    }
  };

  function convertDateFormat(datetime) {
    // 날짜와 시간을 'YYYY-MM-DD HH:MM:SS' 형식으로 파싱합니다.
    const date = new Date(datetime);
  
    // 각 부분을 추출하여 포매팅합니다.
    const year = date.getFullYear().toString().slice(-2); // 년도의 마지막 두 자리
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 월 (0을 추가하여 두 자리수 유지)
    const day = ('0' + date.getDate()).slice(-2); // 일 (0을 추가하여 두 자리수 유지)
    const hours = ('0' + date.getHours()).slice(-2); // 시 (0을 추가하여 두 자리수 유지)
    const minutes = ('0' + date.getMinutes()).slice(-2); // 분 (0을 추가하여 두 자리수 유지)
    const seconds = ('0' + date.getSeconds()).slice(-2); // 초 (0을 추가하여 두 자리수 유지)
  
    // 'YY-MM-DD HH:MM:SS' 형식으로 병합하여 반환합니다.
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="mobile">
      <div className='topBar'></div>
      {/* 페이지 타이틀 */}
      <div className='greenTop flex' style={{ textAlign: "left", textIndent: "10px", justifyContent: "space-between" }}>
        <div>알림 센터</div>
        <div><Sidebar /></div>
      </div>
      {/* 페이지 내용 */}
      <div className='body'>
        {result.length > 0 ? (
          <>
            <button onClick={handleDeleteAll} className="greyButton" style={{margin:"10px 0 0 230px"}}>전체 삭제</button>
            <ul style={{ listStyleType: "none", fontSize: "20px", width: "95%", maxHeight: "540px", overflowY: "auto", position: "relative", right: "27px", bottom:"10px" }}>
              {result.map((result, index) => (
                <li key={index}>
                  <div style={{ textIndent:"10px", color: 'black', display: 'flex', alignItems: 'center', backgroundColor: "white", border: "1px solid lightgrey", borderRadius: "5px", marginBottom: "5px", marginRight: "5px", height:"70px", fontSize:"20px" }}>
                    {convertDateFormat(result.date)} 급수 작동
                    <button className='greyButton' onClick={() => handleDelete(result.alert_ID)} style={{marginLeft:"15px", width:"70px"}}>확인</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div style={{position:"relative", top:"15px", margin:"auto", width:"95%", textIndent:"10px", color: 'black', display: 'flex', alignItems: 'center', backgroundColor: "white", border: "1px solid lightgrey", borderRadius: "5px", marginBottom: "5px", marginRight: "5px", height:"70px", fontSize:"20px" }}>
          알람이 없습니다!</div>
        )}
      </div>
      {/* 하단 버튼 */}
      <DetailButtons />
    </div>
  );
}

export default Alarm2;
