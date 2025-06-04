import React from 'react';

function AdminReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reports Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
          <p className="text-gray-600">View detailed sales analytics and trends</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Order Analytics</h2>
          <p className="text-gray-600">Track order patterns and customer behavior</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue Summary</h2>
          <p className="text-gray-600">Monitor revenue streams and financial metrics</p>
        </div>
      </div>
    </div>
  );
}

export default AdminReportsPage;