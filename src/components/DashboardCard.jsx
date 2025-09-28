import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ title, children }) => {
  return (
    <div className="dashboard-card">
      <h3 className="card-title">{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;