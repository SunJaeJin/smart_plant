import React, { useState } from 'react';
import axios from 'axios';
import Menu from '../components/Menu'; 

const WebAIAdd = () => {
    const [newFlowerName, setNewFlowerName] = useState('');
    const [newFlowerImages, setNewFlowerImages] = useState([]);
    const [isForTest, setIsForTest] = useState(false);

    const handleNewFlowerName = (event) => {
        setNewFlowerName(event.target.value);
    };

    const handleAddData = async () => {
        const formData = new FormData();

        formData.append('plantName', newFlowerName);
        formData.append('isForTest', isForTest);

        newFlowerImages.forEach(image => {
            formData.append('images', image);
        });

        try {
            const response = await axios.post('http://ceprj.gachon.ac.kr:60007/api/ai/ai_dataset', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('데이터 셋이 추가되었습니다.');
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewFlowerImages(files);
    };

    const styles = {
        form: {
            maxWidth: '500px',
            margin: '0 auto',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff'
        },
        formGroup: {
            marginBottom: '15px'
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            textAlign: 'left'
        },
        input: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box'
        },
        button: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#5A5A5A',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '10px'
        },
        buttonDisabled: {
            backgroundColor: '#6c757d',
            cursor: 'not-allowed'
        }
    };

    return (
        <div className="flex web">
            <Menu />
            <div className='flex' style={{scale:"2"}}>
                <div style={styles.form}>
                    <div style={{ fontSize: "30px", marginBottom: "20px" }}>
                        데이터셋 추가
                    </div>
                    <div style={styles.formGroup}>
                        <div style={styles.label}>
                            식물 이름
                        </div>
                        <input type="text" value={newFlowerName} onChange={handleNewFlowerName} placeholder='식물 이름을 입력하세요.' style={styles.input} required/>
                    </div>
                    <div style={styles.formGroup}>
                        <div style={styles.label}>
                            식물 이미지
                        </div>
                        <input type="file" accept=".jpg, .png" multiple onChange={handleImageChange} style={styles.input} required/>
                        <p style={{ marginTop: '10px', fontSize: '16px' }}>선택된 이미지 수: {newFlowerImages.length}</p>
                    </div>
                    <div style={styles.formGroup}>
                        <input type="checkbox" checked={isForTest} onChange={() => setIsForTest(!isForTest)} style={{ marginRight: '5px' }} />
                        <label style={{ fontSize: '16px' }}>테스트 데이터셋에 추가</label>
                    </div>
                    <button type="submit" style={styles.button} onClick={handleAddData}>전송</button>
                </div>
            </div>
        </div>
    );
};

export default WebAIAdd;


