import React, {useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

// 모바일
import Login from './pages/Login';
import Device from './pages/Device';
import Flower from './pages/Flower';
import Bluetooth from './pages/Bluetooth';
import Register from './pages/Register';
import Find from './pages/Find';
import ResetPassword from './pages/ResetPassword';
import FindFlower from './pages/FindFlower';
import FlowerInfo from './pages/FlowerInfo';
import AI from './pages/AI';
import Main from './pages/Main';
import ChangePassword from './pages/ChangePassword';
import Withdraw from './pages/Withdraw';
import DeviceInfo from './pages/DeviceInfo';
import SupportFlower from './pages/SupportFlower';
import FlowerDetail from './pages/FlowerDetail';
import DeviceName from './pages/DeviceName';
import Water from './pages/Water';
import Module from './pages/Module';
import Auto2 from './pages/Auto2';
import DeleteDevice from './pages/DeleteDevice';
import ChangePlant from './pages/ChangePlant';
import Soil2 from './pages/Soil2';
import Temp2 from './pages/Temp2';
import FindFlower2 from './pages/FindFlower2';
import FlowerInfo2 from './pages/FlowerInfo2';
import AI2 from './pages/AI2';
import Use from './pages/Use';
import Use2 from './pages/Use2';
import Use_S from './pages/Use_S';
import Use_S2 from './pages/Use_S2';
import Loading from './pages/Loading';
import Loading2 from './pages/Loading2';
import Inquiry from './pages/Inquiry';
import InquiryList from './pages/InquiryList';
import Survey from './pages/Survey';
import Alarm from './pages/Alarm';

// 웹
import WebLogin from './pages/WebLogin';
import WebMain from './pages/WebMain';
import WebInquiry from './pages/WebInquiry';
import WebUser from './pages/WebUser';
import WebDevice from './pages/WebDevice';
import WebAI from './pages/WebAI';
import WebFlower from './pages/WebFlower';
import WebManager from './pages/WebManager';
import WebUserInfo from './pages/WebUserInfo';
import WebDeviceInfo from './pages/WebDeviceInfo';
import WebAddFlower from './pages/WebAddFlower';
import WebFlowerInfo from './pages/WebFlowerInfo';
import WebAIAdd from './pages/WebAIAdd';
import WebDevice2 from './pages/WebDevice2';
import WebModule from './pages/WebModule';
import WebFirst from './pages/WebFirst';
import WebFlower2 from './pages/WebFlower2';
import WebAnswer from './pages/WebAnswer';

function App() {
    useEffect(() => {
        function handleMessage(event) {
          // 여기서 event.origin을 확인하여 메시지의 출처를 검증하는 것이 좋습니다.
        console.log("Received message:", event.data);
        }
    
        window.addEventListener("message", handleMessage);
    
        // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
        return () => {
        window.removeEventListener("message", handleMessage);
        };
      }, []); // 의존성 배열을 비워둠으로써 컴포넌트가 마운트될 때만 실행됩니다.

    const isMobile = useMediaQuery({ maxWidth: 767 });

return (
<div className="App">
    <Router>
        <Routes>
        {isMobile ? (
            // 모바일
            <>
            <Route path="/" element={<Login />} />
            <Route path="/Device" element={<Device />} />
            <Route path="/Flower" element={<Flower />} />
            <Route path="/Bluetooth" element={<Bluetooth />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Find" element={<Find />} />
            <Route path="/ResetPassword" element={<ResetPassword />} />
            <Route path="/FindFlower" element={<FindFlower />} />
            <Route path="/FlowerInfo/:plantdata_ID" element={<FlowerInfo />} />
            <Route path="/AI" element={<AI />} />
            <Route path="/Main" element={<Main />} />
            <Route path="/ChangePassword" element={<ChangePassword />} />
            <Route path="/Withdraw" element={<Withdraw />} />
            <Route path="/DeviceInfo/:id" element={<DeviceInfo />} />
            <Route path="/SupportFlower" element={<SupportFlower />} />
            <Route path="/FlowerDetail/:plantdata_ID" element={<FlowerDetail/>} />
            <Route path="/DeviceName/:id" element={<DeviceName/>} />
            <Route path="/Temp2" element={<Temp2/>} />
            <Route path="/Soil2" element={<Soil2/>} />
            <Route path="/Water" element={<Water/>} />
            <Route path="/Module" element={<Module/>} />
            <Route path="/Auto2" element={<Auto2/>} />
            <Route path="/DeleteDevice/:id" element={<DeleteDevice/>} />
            <Route path="/ChangePlant" element={<ChangePlant/>} />
            <Route path="/Use" element={<Use/>} />
            <Route path="/Use2" element={<Use2/>} />
            <Route path="/Use_S" element={<Use_S/>} />
            <Route path="/Use_S2" element={<Use_S2/>} />
            <Route path="/FindFlower2" element={<FindFlower2 />} />
            <Route path="/FlowerInfo2/:plantdata_ID" element={<FlowerInfo2 />} />
            <Route path="/AI2" element={<AI2 />} />
            <Route path="/Loading" element={<Loading />} />
            <Route path="/Loading2" element={<Loading2 />} />
            <Route path="/Inquiry" element={<Inquiry />} />
            <Route path="/InquiryList" element={<InquiryList />} />
            <Route path="/Survey" element={<Survey />} />
            <Route path="/Alarm" element={<Alarm />} />
            </>
        ) : (
            // 웹
            <>
            <Route path="/WebLogin" element={<WebLogin />} />
            <Route path="/WebMain" element={<WebMain />} />
            <Route path="/WebInquiry" element={<WebInquiry />} />
            <Route path="/WebAnswer/:id" element={<WebAnswer />} />
            <Route path="/WebUser" element={<WebUser />} />
            <Route path="/WebDevice" element={<WebDevice />} />
            <Route path="/WebDevice2" element={<WebDevice2 />} />
            <Route path="/WebAI" element={<WebAI />} />
            <Route path="/WebAIAdd" element={<WebAIAdd />} />
            <Route path="/WebFlower" element={<WebFlower />} />
            <Route path="/WebFlower2" element={<WebFlower2 />} />
            <Route path="/WebManager" element={<WebManager />} />
            <Route path="/WebUserInfo/:loginID" element={<WebUserInfo />} />
            <Route path="/WebDeviceInfo/:id" element={<WebDeviceInfo />} />
            <Route path="/WebAddFlower" element={<WebAddFlower />} />
            <Route path="/WebFlowerInfo/:plantdata_ID" element={<WebFlowerInfo />} />
            <Route path="/WebAIAdd" element={<WebAIAdd/>}/>
            <Route path="/WebModule/:id" element={<WebModule />} />
            <Route path="/" element={<WebFirst />} />
            </>
        )}
        </Routes>
    </Router>
</div>
);
}

export default App;