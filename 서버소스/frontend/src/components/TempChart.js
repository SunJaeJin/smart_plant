import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function TempChart({ detailData }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
    
        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: detailData.map(data => data.time),
                datasets: [{
                    label: '온도',
                    data: detailData.map(data => data.tempValue),
                    borderColor: '#FF9A9A',
                    backgroundColor: '#FF9A9A',
                },
                {
                    label: '습도',
                    data: detailData.map(data => data.humiValue),
                    borderColor: '#05C67A',
                    backgroundColor: '#05C67A',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [detailData]);

    return <canvas ref={chartRef} style={{ marginTop:"20px" }}></canvas>;
}

export default TempChart;
