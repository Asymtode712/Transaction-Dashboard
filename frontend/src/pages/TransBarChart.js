import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TransBarChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => `${item._id.min} - ${item._id.max}`),
    datasets: [
      {
        label: 'Number of Items',
        data: data.map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bar-chart">
      <h2>Price Range Distribution</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TransBarChart;