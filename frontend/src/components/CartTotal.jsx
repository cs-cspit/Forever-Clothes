import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {
    const {currency,delivery_fee,getCartAmount,getFinalAmount,appliedCoupon,applyCoupon,removeCoupon} = useContext(ShopContext);
    const [code, setCode] = useState('');


  return (
    <div className='w-full border border-gray-250 rounded-xl px-3 sm:px-5 py-3 sm:py-4'>
        <div className='text-xl sm:text-2xl'>
            <Title text1={'CART'} text2={'TOTALS'} />
        </div>

        <div className='flex flex-col gap-2 mt-2 text-xs sm:text-sm'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p className='font-medium'>{currency} {getCartAmount()}.00</p>
            </div>
            <hr />
            {appliedCoupon && appliedCoupon.subtotal === getCartAmount() ? (
                <>
                <div className='flex justify-between'>
                    <p>Discount ({appliedCoupon.code})</p>
                    <p>- {currency} {appliedCoupon.discount}.00</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping fee</p>
                    <p>{currency} {appliedCoupon.delivery}.00</p>
                </div>
                </>
            ) : (
                <>
                    <div className='flex justify-between'>
                        <p>Shipping fee</p>
                        {getCartAmount() >= 1000 ? (
                            <p className="text-green-600">Free Delivery</p>
                        ) : (
                            <p>{currency} {delivery_fee}.00</p>
                        )}
                    </div>
                    {getCartAmount() > 0 && getCartAmount() < 1000 && (
                        <p className="text-sm text-gray-500 italic text-center">Free delivery on orders above {currency}1,000</p>
                    )}
                </>
            )}
            <hr />
            <div className='flex justify-between'>
                <p>Total</p>
                <p>{currency} {getFinalAmount()}.00</p>
            </div>

        </div>

        <div className='mt-4 flex flex-col sm:flex-row items-center gap-2'>
            {appliedCoupon && appliedCoupon.subtotal === getCartAmount() ? (
                <div className='flex items-center gap-2 w-full justify-center sm:justify-start'>
                    <span className='text-green-600 text-xs sm:text-sm'>Applied: {appliedCoupon.code}</span>
                    <button type='button' onClick={removeCoupon} className='text-red-600 text-xs sm:text-sm underline'>Remove</button>
                </div>
            ) : (
                <>
                    <input 
                        value={code} 
                        onChange={(e)=>setCode(e.target.value)} 
                        className='w-full sm:flex-1 border border-gray-300 rounded py-1.5 px-2 text-xs sm:text-sm' 
                        placeholder='Enter coupon code' 
                    />
                    <button 
                        type='button' 
                        onClick={()=>applyCoupon(code)} 
                        className='w-full sm:w-auto bg-black text-white text-xs sm:text-sm px-3 py-1.5 rounded hover:bg-gray-800 transition-colors'
                    >
                        Apply Coupon
                    </button>
                </>
            )}
        </div>

    </div>
  )
}

export default CartTotal