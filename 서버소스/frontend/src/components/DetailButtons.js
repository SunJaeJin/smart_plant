import React from 'react';
import { useNavigate } from 'react-router-dom';

const DetailButtons = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex">
                <button type="button" className='greenButtonD' onClick={() => navigate('/Temp2')} style={{ width: "25%", height: "97px", fontSize: "15px", borderTopLeftRadius:"15px"}}>
                    <img src="/images/Temp2.png" alt="온도/습도"  style={{width:"40px", margin:"3px"}} />
                    <div>온도/습도</div>
                </button>
                <button type="button" className='greenButtonD' onClick={() => navigate('/Water')} style={{ width: "25%", height: "97px", fontSize: "15px"}}>
                    <img src="/images/Water2.png" alt="급수/수위"  style={{width:"40px", margin:"3px"}} />
                    <div>급수/수위</div>
                </button>
                <button type="button" className='greenButtonD' onClick={() => navigate('/Soil2')} style={{ width: "25%", height: "97px", fontSize: "15px"}}>
                    <img src="/images/Soil2.png" alt="토양 습도"  style={{width:"40px", margin:"3px"}} />
                    <div>토양 습도</div>
                </button>
                <button type="button" className='greenButtonD' onClick={() => navigate('/Main')} style={{ width: "25%", height: "97px", fontSize: "15px", borderTopRightRadius:"15px"}}>
                    <img src="/images/Home2.png" alt="메인 화면"  style={{width:"40px", margin:"3px"}} />
                    <div>메인 화면</div>
                </button>
            </div>
        </div>
    );
};

export default DetailButtons;