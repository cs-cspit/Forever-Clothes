import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
<<<<<<< HEAD
      <div className='w-[18%] min-h-screen border-r-2'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
        {/* Navlink Is Used To Navigate Or Show That Which Page Is Currently Active*/}
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/add">
            <img className='w-5 h-5' src={assets.add_icon} alt="" />
            <p className='hidden md:block'>Add Items</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/list">
            <img className='w-5 h-5' src={assets.order_icon} alt="" />
            <p className='hidden md:block'>List Items</p>
        </NavLink>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/orders">
            <img className='w-5 h-5' src={assets.order_icon} alt="" />
            <p className='hidden md:block'>Orders</p>
        </NavLink>
      </div>
=======
    <div className='w-[14%] min-h-screen border-r-2'>
        <div className='flex flex-col gap-4 pt-6 pl-[13%] text-[15px] '>
            
            <NavLink to='/dashboard' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg'>
                <img className='w-5 h-5' src={assets.order_icon} alt="" />
                <p className='hidden md:block'>Dashboard</p>
            </NavLink>

            <NavLink to='/add' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg'>
                <img className='w-5 h-5' src={assets.add_icon} alt="" />
                <p className='hidden md:block'>Add Items</p>
            </NavLink>

            <NavLink to='/list' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg'>
                <img className='w-5 h-5' src={assets.order_icon} alt="" />
                <p className='hidden md:block'>List Items</p>
            </NavLink>

            <NavLink to='/orders' className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg'>
                <img className='w-5 h-5' src={assets.order_icon} alt="" />
                <p className='hidden md:block'>Orders</p>
            </NavLink>
        </div>
>>>>>>> 461b493 (Admin dashboard changes)
    </div>
  )
}

export default Sidebar