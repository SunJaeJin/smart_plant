import React, { useState } from 'react';
import axios from 'axios';

const AITrain = () => {
  const [formData, setFormData] = useState({
    version: '',
    batchSize: '32',
    numEpochs: '1',
    numPatience: '1',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 요청이 보내지는 동안 로딩 상태 설정
  
    try {
      // POST 요청 보내기
      const response = await axios.post('http://ceprj.gachon.ac.kr:60007/api/ai/train_model', formData);
  
      // 응답 처리
      console.log('모델 학습 결과:', response.data);
      alert(response.data); // 학습 결과 메시지 표시
  
      // 입력 상자의 값을 초기화
      setFormData({
        version: '',
        batchSize: '',
        numEpochs: '',
        numPatience: '',
        description: ''
      });
  
      setLoading(false); // 요청 완료 후 로딩 상태 해제
    } catch (error) {
      console.error('모델 학습 요청 실패:', error);
      alert('모델 학습 요청에 실패했습니다.');
      setLoading(false); // 요청 실패 후 로딩 상태 해제
    }
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
        display: 'flex', // 수평 배치 설정
        alignItems: 'center', // 수직 가운데 정렬
        marginBottom: '15px'
    },
    label: {
        flex: '1', // 레이블이 나머지 공간을 채우도록 설정
        marginRight: '10px', // 레이블과 인풋 상자 사이 간격 설정
        marginBottom: '5px',
        fontWeight: 'bold'
    },
    input: {
        flex: '2', // 인풋 상자가 더 크게 나오도록 설정
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box'
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007BFF',
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
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label htmlFor="version" style={styles.label}>버전 이름 :</label>
        <input type="text" id="version" name="version" value={formData.version} onChange={handleChange} required style={styles.input} />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="batchSize" style={styles.label}>배치사이즈 :</label>
        <input type="number" id="batchSize" name="batchSize" value={formData.batchSize} onChange={handleChange} min="1" step="1" required style={styles.input} />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="numEpochs" style={styles.label}>에포크 수 :</label>
        <input type="number" id="numEpochs" name="numEpochs" value={formData.numEpochs} onChange={handleChange} min="1" step="1" required style={styles.input} />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="numPatience" style={styles.label}>조기종료 값 :</label>
        <input type="number" id="numPatience" name="numPatience" value={formData.numPatience} onChange={handleChange} min="1" step="1" required style={styles.input} />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="description" style={styles.label}>모델 설명 :</label>
        <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} required style={styles.input} />
      </div>
      <button type="submit" disabled={loading} style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) ,backgroundColor:" #5A5A5A" }}>
        {loading ? '모델 학습 중...' : '모델 학습 시작'}
      </button>
    </form>
  );
};

export default AITrain;