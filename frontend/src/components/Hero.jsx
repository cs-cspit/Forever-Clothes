import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-300 rounded-xl overflow-hidden mt-4 sm:mt-6 mx-2 sm:mx-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300'>
      
      {/* Left Section */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-0 px-6 sm:px-10 bg-gradient-to-r from-white to-yellow-50'>
        <div className='text-[#2c2c2c]'>
          {/* Tagline */}
          <div className='flex items-center gap-2 mb-3'>
            <p className='w-8 md:w-11 h-[2px] bg-[#2c2c2c]'></p>
            <p className='font-medium text-sm md:text-base tracking-wide uppercase'>Our Bestsellers</p>
          </div>

          {/* Main Heading */}
          <h1 className='prata-regular text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#1a1a1a]'>
            Latest <span className='text-yellow-500'>Arrivals</span>
          </h1>

          {/* Subtitle */}
          <p className='text-gray-600 text-base sm:text-lg mt-4 mb-6 max-w-md'>
            Step into comfort and confidence — discover our latest premium collection crafted for your unique style.
          </p>

          {/* Buttons */}
          <div className='flex items-center gap-4'>
            <a href="/collection" className='inline-flex items-center justify-center px-5 py-2.5 text-sm sm:text-base font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors duration-300'>
              Shop Now
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="/about" className='inline-flex items-center justify-center px-5 py-2.5 text-sm sm:text-base font-medium text-[#2c2c2c] border border-[#2c2c2c] rounded-lg hover:bg-gray-100 transition-colors duration-300'>
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Right Section (Image) */}
      <div className='relative w-full sm:w-1/2'>
        <img 
          src={assets.hero_img} 
          alt="Hero Banner"
          className='w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent'></div>
      </div>
    </div>
  )
}

export default Hero