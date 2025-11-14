import React from 'react';
import SalesDashboard from '../components/SalesDashboard';

const Dashboard = ({ token }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">Sales Dashboard</h1>
          <p className="text-purple-100">Complete sales analytics and performance tracking</p>
        </div>
      </div>
      
      <SalesDashboard token={token} />
    </div>
  );
};

export default Dashboard;
