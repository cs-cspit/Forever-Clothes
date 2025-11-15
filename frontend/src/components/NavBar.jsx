import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import ConfirmationDialog from './ConfirmationDialog';
import { toast } from 'react-toastify';

const NavBar = () => {
  const [visible,setVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { getCartCount, navigate, token, setToken, setCartItems, setUser } = useContext(ShopContext);
  const adminURL = import.meta.env.VITE_ADMIN_URL;

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    toast.success("Successfully logged out!");
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems([]);
    setUser(null);
    setShowLogoutDialog(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-white shadow-md'>
      <div className='max-w-7xl mx-auto px-4 flex items-center justify-between py-4 font-medium'>
        {/* logo */}
        <Link to='/' className="flex items-center">
          <img src={assets.logo} className='w-36 hover:opacity-80 transition-opacity' alt='logo' />
        </Link>

        {/* Navbar */}
        <ul className='hidden sm:flex gap-8 text-sm items-center'>
          <NavLink to='/' className={({ isActive }) => `relative group py-2 ${isActive ? 'text-black' : 'text-gray-600'}`}>
            <span className="hover:text-black transition-colors">HOME</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </NavLink>
          <NavLink to='/collection' className={({ isActive }) => `relative group py-2 ${isActive ? 'text-black' : 'text-gray-600'}`}>
            <span className="hover:text-black transition-colors">COLLECTION</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </NavLink>
          <NavLink to='/about' className={({ isActive }) => `relative group py-2 ${isActive ? 'text-black' : 'text-gray-600'}`}>
            <span className="hover:text-black transition-colors">ABOUT</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </NavLink>
          <NavLink to='/contact' className={({ isActive }) => `relative group py-2 ${isActive ? 'text-black' : 'text-gray-600'}`}>
            <span className="hover:text-black transition-colors">CONTACT</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </NavLink>
          <a href={adminURL} target="_blank" rel="noopener noreferrer">
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm">
              Admin Panel
            </button>
          </a>
        </ul>

      {/* Options */}
      <div className='flex items-center gap-6'>
        <div className='group relative'>
          <button onClick={()=>token? null:navigate('/login')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <img className='w-5' src={assets.profile_icon} alt='Profile'/>
          </button>
          {/* dropdown menu */}
          {token &&
          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
            <div className='flex flex-col w-48 py-3 px-4 bg-white shadow-lg rounded-lg border border-gray-100'>
              <button onClick={()=>navigate('/profile')} className='text-left py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors'>
                My Profile
              </button>
              <button onClick={()=>navigate('/orders')} className='text-left py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors'>
                Orders
              </button>
              <hr className="my-2 border-gray-100" />
              <button onClick={handleLogoutClick} className='text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded-md transition-colors'>
                Logout
              </button>
            </div>
          </div>
          } 
        </div>

        <Link to='/cart' className='relative p-2 hover:bg-gray-100 rounded-full transition-colors'>
          <img src={assets.cart_icon} className='w-5' alt='Cart' />
          {getCartCount() > 0 && (
            <div className='absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center'>
              {getCartCount()}
            </div>
          )}
        </Link>
        <button onClick={()=>setVisible(true)} className="p-2 hover:bg-gray-100 rounded-full transition-colors sm:hidden">
          <img src={assets.menu_icon} className='w-5' alt='Menu' />
        </button>
      </div>

      {/* Side menu for small screen */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute top-0 right-0 bottom-0 w-64 bg-white transform transition-transform ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className='flex flex-col h-full'>
            <div className='flex items-center justify-between p-4 border-b'>
              <h2 className="text-lg font-medium">Menu</h2>
              <button onClick={()=>setVisible(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-2 py-4">
              <NavLink onClick={()=>setVisible(false)} className={({ isActive }) => `block px-4 py-2 rounded-lg mb-1 ${isActive ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`} to='/'>
                HOME
              </NavLink>
              <NavLink onClick={()=>setVisible(false)} className={({ isActive }) => `block px-4 py-2 rounded-lg mb-1 ${isActive ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`} to='/collection'>
                COLLECTION
              </NavLink>
              <NavLink onClick={()=>setVisible(false)} className={({ isActive }) => `block px-4 py-2 rounded-lg mb-1 ${isActive ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`} to='/about'>
                ABOUT
              </NavLink>
              <NavLink onClick={()=>setVisible(false)} className={({ isActive }) => `block px-4 py-2 rounded-lg mb-1 ${isActive ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`} to='/contact'>
                CONTACT
              </NavLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutDialog}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access your account and cart."
        confirmText="Yes, Logout"
        cancelText="Cancel"
      />
    </div>
  </div>
  )
}

export default NavBar