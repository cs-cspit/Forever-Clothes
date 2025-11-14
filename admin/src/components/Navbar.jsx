import React, { useState } from 'react'
import { assets } from '../assets/assets'
import ConfirmationDialog from './ConfirmationDialog'
import { toast } from 'react-toastify'

const Navbar = ({setToken}) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    toast.success("Successfully logged out!");
    setToken('');
    setShowLogoutDialog(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      <div className='flex items-center py-2 px-[4%] justify-between'>
          <img className='w-[max(10%,80px)]' src={assets.logo} alt="logo" />
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <div className='w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center'>
                <svg className='w-4 h-4 text-gray-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className='text-sm text-gray-600'>admin@gmail.com</span>
            </div>
            <button 
              onClick={handleLogoutClick} 
              className='bg-black hover:bg-gray-800 active:bg-gray-700 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm transition-colors duration-200'
            >
              Logout
            </button>
          </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutDialog}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout from the admin panel? You will need to login again to access the dashboard."
        confirmText="Yes, Logout"
        cancelText="Cancel"
      />
    </>
  )
}

export default Navbar