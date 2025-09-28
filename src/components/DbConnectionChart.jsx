import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchAndParse } from '../api/parser';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DbConnectionChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const mysqlUrl = import.meta.env.VITE_MYSQL_EXPORTER_URL;

  useEffect(() => {
    const getMetrics = async () => {
      const connections = await fetchAndParse(mysqlUrl, 'mysql_global_status_threads_connected');
      
      setChartData(prevData => {
        const now = new Date();
        const newLabel = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const newLabels = [...(prevData.labels || []).slice(-9), newLabel];
        const newData = [...(prevData.datasets[0]?.data || []).slice(-9), connections || 0];

        return {
          labels: newLabels,
          datasets: [{
            label: 'Active Connections',
            data: newData,
            borderColor: '#FF8C00',
            backgroundColor: 'rgba(255, 140, 0, 0.5)',
            tension: 0.1
          }],
        };
      });
    };

    getMetrics();
    const interval = setInterval(getMetrics, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#e0e0e0' }
      },
      x: {
        ticks: { color: '#e0e0e0' }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#e0e0e0'
        }
      }
    },
  };

  return <Line options={options} data={chartData} />;
};

export default DbConnectionChart;