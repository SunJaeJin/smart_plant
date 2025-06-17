import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Menu from '../components/Menu'
import axios from 'axios';

const WebUserInfo = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const { loginID } = useParams();

    useEffect(() => {
        axios.get(`http://ceprj.gachon.ac.kr:60007/api/admin/users/${loginID}`)
            .then(response => {
                console.log(response.data);
                setUserInfo(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, [loginID]);

    const deleteUser = () => {
        const isConfirmed = window.confirm('정말 삭제하시겠습니까?');
        
        if (isConfirmed) {
            axios.delete(`http://ceprj.gachon.ac.kr:60007/api/admin/users/${loginID}`)
                .then(response => {
                    console.log('User deleted successfully');
                    navigate('/WebUser');
                })
                .catch(error => {
                    console.error('There was an error deleting the user!', error);
                });
        } else {
            console.log('User deletion cancelled');
        }
    };

    const extractT = (datetimeString) => {
        const newBirth = datetimeString.split('T')[0];
        console.log("extractT(userInfo.birth):", newBirth);
        return newBirth;
    };

    return (
        <div className="flex web">
            <Menu />
            <div className='flex'>
                <div className='contents'>
                    <div className="darkTitle" style={{margin:"50px 0 0 90px", width:"300px"}}>
                        회원 상세 정보
                    </div>
                    <div style={{position:"relative", bottom:"50px"}}>
                    <button type="button" className='darkButton' onClick={deleteUser} style={{width:"200px", height:"70px", marginLeft:"1150px"}}>회원 탈퇴</button>
                    {userInfo && (
                    <table style={{width:"90%", height:"65%",padding:"30px 10px 20px 10px", margin:"auto", marginTop:"10px"}}>
                        <tr>
                        <th className="tableHeader2">회원 ID</th> <td className="tableData2">{userInfo.user_ID}</td>
                        <th className="tableHeader2">이메일</th> <td className="tableData2">{userInfo.email}</td>
                        </tr>
                        <tr>
                        <th className="tableHeader2">회원 이름</th> <td className="tableData2">{userInfo.name}</td>
                        <th className="tableHeader2">성별</th> <td className="tableData2">{userInfo.gender}</td>
                        </tr>
                        <tr>
                        <th className="tableHeader2">디바이스 ID</th> <td className="tableData2">{userInfo.device_ID ? userInfo.device_ID : 'None'}</td>
                        <th className="tableHeader2">생년월일</th> <td className="tableData2">{extractT(userInfo.birth)}</td>
                        </tr>
                        <tr>
                        <th className="tableHeader2">가입 날짜</th> <td className="tableData2">{extractT(userInfo.register_date)}</td>
                        <th className="tableHeader2">계정 상태</th> <td className="tableData2">{userInfo.status}</td>
                        </tr>
                    </table>
                    )}
                    </div>
                    {/* <button type="button" className='darkButton' onClick={() => navigate(`/WebDeviceInfo/${userInfo.loginID}`)} style={{width:"300px", height:"100px", margin:"auto", fontSize:"35px"}}>디바이스 상세</button> */}
                </div>
            </div>
        </div>
    );
};

export default WebUserInfo;