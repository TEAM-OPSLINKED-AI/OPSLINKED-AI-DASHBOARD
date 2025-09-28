import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchAndParse } from '../api/parser';

ChartJS.register(ArcElement, Tooltip, Legend);

const JvmHeapChart = () => {
  const [chartData, setChartData] = useState({ datasets: [] });
  const springUrl = import.meta.env.VITE_SPRING_EXPORTER_URL;

  useEffect(() => {
    const getMetrics = async () => {
      const usedBytes = await fetchAndParse(springUrl, 'jvm_memory_used_bytes', { area: 'heap' });
      const maxBytes = await fetchAndParse(springUrl, 'jvm_memory_max_bytes', { area: 'heap' });

      let usage = 0;
      if (usedBytes !== null && maxBytes !== null && maxBytes > 0) {
        usage = (usedBytes / maxBytes) * 100;
      }
      
      setChartData({
        labels: ['Used', 'Free'],
        datasets: [{ data: [usage, 100 - usage], backgroundColor: ['#FF8C00', '#4B4B64'], borderColor: ['#FF8C00', '#4B4B64'] }],
      });
    };

    getMetrics();
    const interval = setInterval(getMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e0e0e0'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw.toFixed(2)}%`
        }
      },
    },
    cutout: '70%',
  };

  return <Doughnut data={chartData} options={options} />;
};

export default JvmHeapChart;