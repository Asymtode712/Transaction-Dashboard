import React from 'react';

const TransStats = ({ stats }) => {
  return (
    <div className="statistics">
      <div className="stat-box">
        <h3>Total Sale Amount</h3>
        <p>${stats.totalSaleAmount.toFixed(2)}</p>
      </div>
      <div className="stat-box">
        <h3>Total Sold Items</h3>
        <p>{stats.soldItems}</p>
      </div>
      <div className="stat-box">
        <h3>Total Not Sold Items</h3>
        <p>{stats.notSoldItems}</p>
      </div>
    </div>
  );
};

export default TransStats;
