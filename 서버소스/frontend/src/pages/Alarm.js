import React, { useEffect, useState } from 'react';
import '../App.css';
import Sidebar from '../components/Sidebar.js';
import DetailButtons from '../components/DetailButtons.js';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://ceprj.gachon.ac.kr:60007');

function Alarm() {
  const [pumpNotifications, setPumpNotifications] = useState([]);
  const [waterNotifications, setWaterNotifications] = useState([]);
  const [inquiryNotifications, setInquiryNotifications] = useState([]);
  // const [userId, setUserId] = useState(null);

  // useEffect(() => {
  //   axios.get(`http://ceprj.gachon.ac.kr:60007/api/users/id-info`)
  //     .then(response => {
  //         setUserId(response.data); 
  //         console.log(response.data);
  //     })
  //     .catch(error => console.log(error));
  // }, []);

  // useEffect(() => {
  //   if (userId !== null) {  
  //     console.log('Setting up socket listener for userId:', userId);

  //     socket.on('connect', () => {
  //       console.log('Socket connected:', socket.id);
  //     });

  //     socket.on('disconnect', () => {
  //       console.log('Socket disconnected');
  //     });

  //     const alertEvent = 'new-alert' + userId.Id; 
  //     socket.on(alertEvent, (data) => {
  //       console.log('New alert received:', data.message);
  //       alert(data.message);

  //       const newNotification = {
  //         message: data.message,
  //         type: data.type,
  //         date: new Date().toISOString()
  //       };

  //       if (newNotification.type === 'Pump') {
  //         setPumpNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  //       } else if (newNotification.type === 'water') {
  //         setWaterNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  //       }
  //     });

  //     return () => {
  //       console.log('Cleaning up socket listener for userId:', userId);
  //       socket.off(alertEvent);  
  //     };
  //   }
  // }, [userId]);

  useEffect(() => {
    axios.get('http://ceprj.gachon.ac.kr:60007/api/users/notifications')
      .then(response => {
        console.log(response.data);
        const pumpNotifs = response.data[0].filter(notification => notification.type === 'Pump');
        const waterNotifs = response.data[0].filter(notification => notification.type === 'water');
        const inquiryNotifs = response.data[0].filter(notification => notification.type === 'inquiry');

        setPumpNotifications(pumpNotifs);
        setWaterNotifications(waterNotifs);
        setInquiryNotifications(inquiryNotifs);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  const handleDelete = async (alertId) => {
    try {
        const response = await axios.patch(`http://ceprj.gachon.ac.kr:60007/api/users/notifications/read/${alertId}`, {});
        if (response.status === 200) {
          console.log('삭제 성공');
          window.location.reload();
        } else {
          console.error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
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

  const handleDeleteAll = async () => {
    try {
        const response = await axios.delete(`http://ceprj.gachon.ac.kr:60007/api/users/notifications`, {});
        if (response.status === 200) {
          console.log('전체 삭제 성공');
          setPumpNotifications([]);
          setWaterNotifications([]);
        } else {
          console.error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting all notifications:', error);
    }
  };

  function convertDateFormat(datetime) {
    const date = new Date(datetime);
    const year = date.getFullYear().toString().slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="mobile">
      <div className='topBar'></div>
      <div className='greenTop flex' style={{ textAlign: "left", textIndent: "10px", justifyContent: "space-between" }}>
        <div>알림 센터</div>
        <div><Sidebar /></div>
      </div>
        <div className='body'>
    {(pumpNotifications.length > 0 || waterNotifications.length > 0 || inquiryNotifications.length > 0) ? (
      <>
        <button onClick={handleDeleteAll} className="greyButton" style={{ margin: "10px 0 0 230px" }}>전체 삭제</button>
        <ul style={{ listStyleType: "none", fontSize: "17px", width: "95%", maxHeight: "540px", overflowY: "auto", position: "relative", right: "27px", bottom: "10px" }}>
          {pumpNotifications.map((notification, index) => (
            <li key={index}>
              <div style={{ textIndent: "10px", color: 'black', display: 'flex', alignItems: 'center', backgroundColor: "white", border: "1px solid lightgrey", borderRadius: "5px", marginBottom: "5px", marginRight: "5px", height: "70px", fontSize: "17px" }}>
                {convertDateFormat(notification.date)} 급수 작동
                <button className='greyButton' onClick={() => handleDelete(notification.alert_ID)} style={{ width: "70px", position:"absolute", right:"15px" }}>확인</button>
              </div>
            </li>
          ))}
          {waterNotifications.map((notification, index) => (
            <li key={index}>
              <div style={{ textIndent: "10px", color: 'black', display: 'flex', alignItems: 'center', backgroundColor: "white", border: "1px solid lightgrey", borderRadius: "5px", marginBottom: "5px", marginRight: "5px", height: "70px", fontSize: "17px" }}>
                {convertDateFormat(notification.date)} 수위 낮음
                <button className='greyButton' onClick={() => handleDelete(notification.alert_ID)} style={{ marginLeft: "15px", width: "70px" }}>확인</button>
              </div>
            </li>
          ))}
          {inquiryNotifications.map((notification, index) => (
            <li key={index}>
              <div style={{ textIndent: "10px", color: 'black', display: 'flex', alignItems: 'center', backgroundColor: "white", border: "1px solid lightgrey", borderRadius: "5px", marginBottom: "5px", marginRight: "5px", height: "70px", fontSize: "17px" }}>
                {convertDateFormat(notification.date)} 문의 답변 등록
                <button className='greyButton' onClick={() => handleDelete(notification.alert_ID)} style={{ marginLeft: "15px", width: "70px" }}>확인</button>
              </div>
            </li>
          ))}
        </ul>
      </>
    ) : (
      <div style={{ position: "relative", top: "15px", margin: "auto", width: "95%", textIndent: "10px", color: 'black', display: 'flex', alignItems: 'center', backgroundColor: "white", border: "1px solid lightgrey", borderRadius: "5px", marginBottom: "5px", marginRight: "5px", height: "70px", fontSize: "20px" }}>
        알람이 없습니다!
      </div>
    )}
  </div>

      <DetailButtons />
    </div>
  );
}

export default Alarm;