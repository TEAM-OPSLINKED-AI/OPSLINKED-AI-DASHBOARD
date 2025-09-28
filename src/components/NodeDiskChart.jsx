import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchMetricsFromGrafana } from '../api/grafana';

ChartJS.register(ArcElement, Tooltip, Legend);

const NodeDiskChart = () => {
  const [chartData, setChartData] = useState({ datasets: [] });

  useEffect(() => {
    const getMetrics = async () => {
      const promql = '(1 - (node_filesystem_avail_bytes{mountpoint="/", instance="172.20.112.101:9100"} / node_filesystem_size_bytes{mountpoint="/", instance="172.20.112.101:9100"})) * 100';
      const result = await fetchMetricsFromGrafana(promql);
      const usage = result.length > 0 ? parseFloat(result[0].value[1]) : 0;

      setChartData({
        labels: ['Used', 'Free'],
        datasets: [{
          data: [usage, 100 - usage],
          backgroundColor: ['#FF8C00', '#4B4B64'],
          borderColor: ['#FF8C00', '#4B4B64'],
        }],
      });
    };

    getMetrics();
    const interval = setInterval(getMetrics, 15000);
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

export default NodeDiskChart;