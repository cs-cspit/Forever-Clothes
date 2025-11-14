import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import { ToastContainer } from 'react-toastify';
import { assets } from './assets/assets';

export const backendUrl = import.meta.env.VITE_BACKEND_URL; // Backend URL
export const currency = '₹';
export { assets };

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'):""); // Get token from local storage
  useEffect(()=>{
    localStorage.setItem('token', token); // Save token to local storage 
    //this will help to keep the user logged in even after the page is refreshed
  },[token]);
  
  // const [token, setToken] = useState(""); // Token state

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      {token === "" ? (
        <Login setToken={setToken}/>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar setToken={setToken}/>
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="p-6">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard token={token}/>} />
                  <Route path="/add" element={<Add token={token}/>} />
                  <Route path="/list" element={<List token={token}/>} />
                  <Route path="/orders" element={<Orders token={token}/>} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
