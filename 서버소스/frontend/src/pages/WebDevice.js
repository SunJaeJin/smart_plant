import React from 'react';
import Menu from '../components/Menu'
import DeviceList from '../components/DeviceList';

const WebDevice = () => {
    return (
        <div className="flex web">
            <Menu />
            <div className='flex'>
                <div className='contents'>
                        <div className="darkTitle">
                            디바이스 목록
                        </div>
                        <form className='webSearch' style={{width:"87%"}}>
                            <input style ={{width:"90%", height:"60%", border:"none", borderRadius:"10px", paddingLeft:"10px", fontFamily:"main_font", fontSize:"30px"}}
                                type="text"
                                placeholder="검색하기"
                            />
                            <button style ={{width:"10%", height:"100%", fontFamily:"main_font", fontSize:"30px", marginLeft:"20px"}} type="submit">검색</button>
                        </form>
                        <div className='flex'>
                            <div className='greyBox' style={{margin:"10px 40px 10px 30px"}}>디바이스 ID</div>
                            <div className='greyBox' style={{marginRight:"40px"}}>사용자 아이디</div>
                            <div className='greyBox' style={{marginRight:"40px"}}>디바이스 이름</div>
                            <div className='greyBox' style={{marginRight:"40px", width:"410px"}}>디바이스 정보</div>
                            <div className='greyBox' style={{width:""}}>디바이스 관리</div>
                        </div>
                        <DeviceList/>
                </div>
            </div>
        </div>
    );
};

export default WebDevice;