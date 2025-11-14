import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
    const {navigate,token,setCartItems,backendUrl,getProductData} = useContext(ShopContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [verifying, setVerifying] = useState(true);
    const [message, setMessage] = useState('Processing payment...');
    
    // Stripe returns `session=true|false` in this project; older code used `success`.
    // Accept either param name for backward compatibility and normalize to boolean.
    const sessionParam = searchParams.get('session') ?? searchParams.get('success');
    const success = sessionParam === 'true';
    const orderId = searchParams.get('orderId');

    const verifyPayment = async()=>{
        try{
            if(!token){
                setMessage('Please log in again');
                setVerifying(false);
                setTimeout(() => navigate('/login'), 2000);
                return null;
            }
            
            // Send boolean `success` to backend. auth middleware will attach userId from token.
            const response = await axios.post(backendUrl+'/api/order/verify',{success,orderId},{headers:{token}});
            
            if(response.data.success){
                // Refresh product data so stock updates on frontend/admin
                try{ await getProductData(); }catch(err){}
                setCartItems({});
                setMessage('✓ Payment successful! Redirecting to orders...');
                // Redirect immediately after success
                navigate('/orders');
            }else{
                setMessage('✗ Payment failed. Redirecting to cart...');
                // Redirect immediately after failure
                navigate('/cart');
            }
            setVerifying(false);
        }
        catch(error){
            console.log(error);
            setMessage('Error verifying payment');
            toast.error(error.message);
            setVerifying(false);
        }
    } 

    useEffect(()=>{
        verifyPayment();
    },[token]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='text-center'>
        {verifying && (
          <div>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4'></div>
            <p className='text-xl font-semibold text-gray-700'>{message}</p>
          </div>
        )}
        {!verifying && (
          <p className='text-lg font-medium text-gray-700'>{message}</p>
        )}
      </div>
    </div>
  )
}

export default Verify