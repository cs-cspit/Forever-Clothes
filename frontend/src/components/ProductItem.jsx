import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({id, image, name, price, quantity}) => {
    const {currency} = useContext(ShopContext);

    // Function to handle click and scroll to top
    const handleProductClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

  return (
    <Link 
      to={`/product/${id}`} 
      className='group relative block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300' 
      onClick={handleProductClick}
    >
      {/* Image Container */}
      <div className='aspect-square overflow-hidden rounded-t-xl bg-gray-100'>
        <img 
          className='w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500' 
          src={image[0]} 
          alt={name} 
        />
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300'></div>
      </div>

      {/* Product Info */}
      <div className='p-3 sm:p-4'>
        <h3 className='text-sm sm:text-base font-medium text-gray-900 line-clamp-1 group-hover:text-black transition-colors'>
          {name}
        </h3>
        <div className='mt-2 flex items-center justify-between'>
          <div>
            <p className='text-base sm:text-lg font-semibold text-black'>
              {currency}{price}
            </p>
            <p className={`text-xs ${quantity > 0 ? 'text-gray-600' : 'text-red-600'}`}>
              {typeof quantity !== 'undefined' ? (quantity > 0 ? `In stock: ${quantity}` : 'Out of stock') : 'Stock: N/A'}
            </p>
          </div>
          <button className='hidden sm:block px-3 py-1 text-sm text-black bg-gray-100 rounded-full opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300'>
            View Details
          </button>
          <button className='sm:hidden px-2 py-1 text-xs text-black bg-gray-100 rounded-full'>
            View
          </button>
        </div>
      </div>

      {/* Quick View Overlay */}
      <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
        <div className='bg-white p-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all'>
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem