import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
<<<<<<< HEAD
      <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
      <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
=======
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="logo" />
        <button onClick={()=>setToken('')} className='bg-black active:bg-gray-700 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
>>>>>>> 461b493 (Admin dashboard changes)
    </div>
  )
}

export default Navbar