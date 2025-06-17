import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const AIChart2 = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: '모델 정확도',
        data: [],
        backgroundColor: [
          '#adadad97'
        ],
        borderColor: [
          '#33363F'
        ],
        borderWidth: 1,
      },
    ],
  });

  const options = {
    indexAxis: 'y',
    scales: {
      y: {
        title: {
          display: true,
          text: '버전'
        },
      },
      x: {
        beginAtZero: true,
        max: 1,
        title: {
          display: true,
          text: '정확도'
        }
      }
    },
  };

  useEffect(() => {
    axios.get('http://ceprj.gachon.ac.kr:60007/api/ai/ai_model_accuracies')
      .then(response => {
        console.log('모델별 성능 :', response.data);
        const newLabels = response.data.map(item => item.version); // version을 labels로 설정
        const newData = response.data.map(item => item.accuracy); // accuracy를 데이터로 설정

        setChartData(prevChartData => ({
          ...prevChartData,
          labels: newLabels,
          datasets: [
            {
              ...prevChartData.datasets[0],
              data: newData
            }
          ]
        }));
      })
      .catch(error => console.log(error));
  }, []);
  
  return <Bar data={chartData} options={options} />;
};

export default AIChart2;
