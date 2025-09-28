import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchAndParse } from '../api/parser';

ChartJS.register(ArcElement, Tooltip, Legend);

const HttpErrorsChart = () => {
  const [chartData, setChartData] = useState({ datasets: [] });
  const springUrl = import.meta.env.VITE_SPRING_EXPORTER_URL;

  useEffect(() => {
    const getMetrics = async () => {
      const allRequests = await fetchAndParse(springUrl, 'http_server_requests_seconds_count');
      const errorRequests = await fetchAndParse(springUrl, 'http_server_requests_seconds_count', { status: '~5' });

      let errorRatio = 0;
      if (allRequests > 0) {
        errorRatio = ((errorRequests || 0) / allRequests) * 100;
      }
      
      setChartData({
        labels: ['5xx Errors', 'Other Requests'],
        datasets: [{ data: [errorRatio, 100 - errorRatio], backgroundColor: ['#FF8C00', '#4B4B64'], borderColor: ['#FF8C00', '#4B4B64'] }],
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

export default HttpErrorsChart;