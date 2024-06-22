// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransTable from './TransTable';
import TransStats from './TransStats';
import TransBarChart from './TransBarChart';
import TransPieChart from './TransPieChart';

const Dashboard = () => {
    const [month, setMonth] = useState('03'); // Default to March
    const [data, setData] = useState(null);
  
    useEffect(() => {
      fetchData();
    }, [month]);
  
    const fetchData = async () => {
        try {
          const [transactions, stats, barchart, piechart] = await Promise.all([
            axios.get(`http://localhost:5000/api/transactions?month=${month}`),
            axios.get(`http://localhost:5000/api/stats?month=${month}`),
            axios.get(`http://localhost:5000/api/barchart?month=${month}`),
            axios.get(`http://localhost:5000/api/piechart?month=${month}`),
          ]);
      
          setData({
            transactions: transactions.data,
            stats: stats.data,
            barchart: barchart.data,
            piechart: piechart.data,
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
    const handleMonthChange = (e) => {
      setMonth(e.target.value);
    };
  
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    return (
      <div className="dashboard">
        <h1>Sales Dashboard</h1>
        <select value={month} onChange={handleMonthChange}>
          {monthNames.map((name, index) => (
            <option key={index} value={(index + 1).toString().padStart(2, '0')}>
              {name}
            </option>
          ))}
        </select>
      {data && (
        <>
          <TransStats stats={data.stats} />
          <TransTable transactions={data.transactions} month={month} />
          <div className="charts">
            <TransBarChart data={data.barchart} />
            <TransPieChart data={data.piechart} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;