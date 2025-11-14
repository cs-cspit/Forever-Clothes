import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { backendUrl, currency } from '../App';
import {toast} from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({token}) => {
  const [orders,setOrders] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllOrders = async() => {
    if(!token){
      return null;
    }else{
      try{
        const response = await axios.post(backendUrl+"/api/order/list",{},{headers:{token}});
        if(response.data.success){
          setOrders(response.data.orders.reverse());
          setLastUpdated(new Date());
        }else{
          toast.error(response.data.message);
        }
      }
      catch(error){
        console.log(error.message);
        toast.error(response.data.message);
      }
    }
  }

  const statusHandler = async(event,orderId) => {
    try{
      const response = await axios.post(backendUrl+"/api/order/status",{orderId, status:event.target.value},{headers:{token}});
      if(response.data.success){
        await fetchAllOrders();
      }
    }
    catch(error){
      console.log(error.message);
      toast.error(response.data.message);
    }
  }

  // Filter orders based on status and search
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    
    // Create full name for better search
    const fullName = `${order.address.firstName} ${order.address.lastName}`.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = fullName.includes(searchTermLower) ||
                         order.address.firstName.toLowerCase().includes(searchTermLower) ||
                         order.address.lastName.toLowerCase().includes(searchTermLower) ||
                         order.address.phone.includes(searchTerm) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTermLower));
    return matchesStatus && matchesSearch;
  });

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch(status) {
      case 'Order Placed':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '📋' };
      case 'Packed':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '📦' };
      case 'Shipped':
        return { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🚚' };
      case 'Out of Delivery':
        return { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '🚛' };
      case 'Delivered':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' };
      case 'Cancelled':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '📋' };
    }
  };

  useEffect(() => {
    fetchAllOrders();
    
    // Auto-refresh orders every 30 seconds to catch cancellations
    const interval = setInterval(() => {
      fetchAllOrders();
    }, 30000);
    
    return () => clearInterval(interval);
  },[token]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
              <p className="text-orange-100">Track and manage customer orders</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={fetchAllOrders}
                className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh Orders</span>
              </button>
            </div>
          </div>
          {lastUpdated && (
            <p className="text-orange-200 text-sm mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        {/* Search and Filter Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by customer name, phone, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="All">All Status</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out of Delivery">Out of Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="space-y-6">
        {filteredOrders.map((order,index) => {
          const statusInfo = getStatusInfo(order.status);
          return (
            <div key={index} className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-xl ${
              order.status === 'Cancelled' 
                ? 'border-red-200 bg-red-50' 
                : 'border-gray-100 hover:border-orange-200'
            }`}>
              {/* Order Header */}
              <div className={`px-6 py-4 border-b ${
                order.status === 'Cancelled' ? 'border-red-200 bg-red-100' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {order.address.firstName} {order.address.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">{currency}{order.amount}</p>
                      <p className="text-sm text-gray-600">{order.items.length} items</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border ${statusInfo.color} flex items-center space-x-2`}>
                      <span>{statusInfo.icon}</span>
                      <span className="font-medium">{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Order Items */}
                  <div className="lg:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            {item.image && item.image.length > 0 ? (
                              <img
                                src={item.image[0]}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800">{item.name}</h5>
                            <p className="text-sm text-gray-600">Size: {item.size} • Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">{currency}{item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Customer Details
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="font-medium text-gray-800">{order.address.firstName} {order.address.lastName}</p>
                        <p className="text-sm text-gray-600">{order.address.street}</p>
                        <p className="text-sm text-gray-600">{order.address.city}, {order.address.state}</p>
                        <p className="text-sm text-gray-600">{order.address.country} - {order.address.zipcode}</p>
                        <p className="text-sm text-gray-600 font-medium">{order.address.phone}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payment Details
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Method:</span>
                          <span className="text-sm font-medium text-gray-800">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`text-sm font-medium ${order.payment ? 'text-green-600' : 'text-red-600'}`}>
                            {order.payment ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Update Status
                      </h4>
                      {order.status === 'Delivered' ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                          <div className="flex items-center justify-center space-x-2 text-green-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">Order Delivered</span>
                          </div>
                        </div>
                      ) : order.status === 'Cancelled' ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                          <div className="flex items-center justify-center space-x-2 text-red-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="font-medium">Order Cancelled</span>
                          </div>
                          <p className="text-sm text-red-600 mt-2">⚠️ Cancelled by Customer</p>
                        </div>
                      ) : (
                        <select 
                          onChange={(event)=>statusHandler(event,order._id)} 
                          value={order.status} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out of Delivery">Out of Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-2 text-gray-500">
            {searchTerm || filterStatus !== 'All' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'No orders have been placed yet.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Orders