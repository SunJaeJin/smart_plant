import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const AIChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: '데이터셋',
        data: [],
        backgroundColor: '#adadad97',
        borderColor: '#33363F',
        borderWidth: 1,
      },
    ],
  });

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '',
        },
      },
      x: {
        title: {
          display: true,
          text: '식물 이름',
        },
      },
    },
  };

  useEffect(() => {
    axios.get('http://ceprj.gachon.ac.kr:60007/api/ai/ai_dataset_info')
      .then(response => {
        console.log('데이터셋 :', response.data);
        const { labels, data } = response.data;
        setChartData({
          ...chartData,
          labels,
          datasets: [
            {
              ...chartData.datasets[0],
              data
            }
          ]
        });
      })
      .catch(error => console.log(error));
  }, []);
  
  return <Bar data={chartData} options={options} />;
};

export default AIChart;
