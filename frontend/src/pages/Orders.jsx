import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import ConfirmationDialog from '../components/ConfirmationDialog';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const {backendUrl,token,currency} = useContext(ShopContext);
  const [orderData,setOrderData] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const loadOrderData = async()=>{
    try{
      if (!token) {
        return null;
      }
      const response = await axios.post(backendUrl+'/api/order/userorders',{},{headers:{token}});
      if(response.data.success){
        let allOrdersItem=[];
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            const enriched = { ...item };
            enriched['status'] = order.status;
            enriched['payment'] = order.payment;
            enriched['paymentMethod'] = order.paymentMethod;
            enriched['date'] = order.date;
            enriched['orderId'] = order._id;
            enriched['amount'] = order.amount;
            enriched['subtotal'] = order.subtotal ?? 0;
            enriched['discount'] = order.discount ?? 0;
            enriched['couponCode'] = order.couponCode ?? '';
            allOrdersItem.push(enriched);
          })
        })
        setOrderData(allOrdersItem.filter(o => o.status !== 'Cancelled').reverse());
      }
    }
    catch(error){

    }
  }

  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setShowConfirmDialog(true);
  };

  const cancelOrder = async () => {
    try{
      if(!token || !orderToCancel) return;
      const response = await axios.post(backendUrl+'/api/order/cancel',{orderId: orderToCancel},{headers:{token}});
      if(response.data.success){
        setOrderData(prev => prev.filter(o => o.orderId !== orderToCancel));
        toast.success('Order cancelled successfully');
      } else {
        toast.error(response.data.message || 'Failed to cancel order');
      }
    }catch(error){
      console.log(error);
      toast.error('Failed to cancel order');
    } finally {
      setShowConfirmDialog(false);
      setOrderToCancel(null);
    }
  };

  const handleCancelConfirm = () => {
    cancelOrder();
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
    setOrderToCancel(null);
  };

  useEffect(()=>{
    loadOrderData();
  },[token]);

  return (
    <div className='border-t pt-16'>

      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {
          orderData.map((item,index)=>(
            <div key={index} className='py-4 border-t text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p>{currency}{item.price}</p>
                    <p>Quantity : {item.quantity}</p>
                    <p>Size : {item.size}</p>
                  </div>
                  <div className='mt-1 text-sm text-gray-600'>
                    {item.couponCode ? (
                      <p>Coupon: <span className='text-green-600'>{item.couponCode}</span> | Discount: {currency}{item.discount}</p>
                    ) : null}
                    <p>Total paid: <span className='text-gray-800 font-medium'>{currency}{item.amount}</span></p>
                  </div>
                  <p className='mt-1'>Date : <span className='text-gray-400'>{new Date(item.date).toLocaleString()}</span></p>
                  <p className='mt-1'>Payment : <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>

              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>
                {item.status !== 'Delivered' && item.status !== 'Cancelled' ? (
                  <button onClick={()=>handleCancelClick(item.orderId)} className='bg-red-600 active:bg-red-800 text-white px-4 py-2 text-sm rounded-lg'>Cancel order</button>
                ) : null}
              </div>
              
            </div>
          ))
        }
      </div>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={handleCancelClose}
        onConfirm={handleCancelConfirm}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Yes, Cancel Order"
        cancelText="Keep Order"
      />

    </div>
  )
}

export default Orders