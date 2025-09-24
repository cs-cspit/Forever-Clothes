import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const [method,setMethod] = useState('cod');
  const {navigate,backendUrl,token,cartItems,setCartItems,getCartAmount,delivery_fee,products} = useContext(ShopContext);
  const [formdata,setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:''
  });

  const onChangeHandler = (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({...data,[name]:value}));
  }

  const onSubmitHandler = async(event)=>{
    event.preventDefault();
    try{
      let orderItems = [];
      for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item]>0){
            const itemInfo = structuredClone(products.find(product=>product._id===items));
            if(itemInfo){
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
      
      let orderData = {
        address : formdata,
        items : orderItems,
        amount : getCartAmount() + delivery_fee
      }

      switch (method){
        //API calls for COD
        case 'cod' :
          const response = await axios.post(backendUrl+'/api/order/place',orderData,{headers:{token}});
          if(response.data.success){
            setCartItems({});
            navigate('/orders');
          }else{
            toast.error(response.data.message);
          }
          break;
        case 'stripe' :
          const responseStripe = await axios.post(backendUrl+'/api/order/stripe',orderData,{headers:{token}});
          if(responseStripe.data.success){
            const {session_url} = responseStripe.data;
            window.location.replace(session_url);
          }else{
            toast.error(responseStripe.data.message);
          }
          break;

        default :
          break;
      }
    } 
    catch(error){
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-4 min-h-[80vh] border-t'>

      {/* -----------------Left side - Delivery Information---------------------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='firstName' value={formdata.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='First name' type="text" required/>
          <input onChange={onChangeHandler} name='lastName' value={formdata.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Last name' type="text" required/>
        </div>
        <input onChange={onChangeHandler} name='email' value={formdata.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Email address' type="email" required/>
        <input onChange={onChangeHandler} name='street' value={formdata.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Street' type="text" required/>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='city' value={formdata.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='City' type="text" required/>
          <input onChange={onChangeHandler} name='state' value={formdata.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='State' type="text" required/>
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='zipcode' value={formdata.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Zipcode' type="number" required/>
          <input onChange={onChangeHandler} name='country' value={formdata.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Country' type="text" required/>
        </div>
        <input onChange={onChangeHandler} name='phone' value={formdata.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Phone' type="number" required/>
      </div>

      {/* ------------------------Right side - Payments----------------------- */}
      <div className='mt-8'>

        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'}/>
          {/* -----Payment Metod selection----- */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            {/* Stripe */}
            <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='stripe'? 'bg-green-400':''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            {/* Razorpay */}
            <div onClick={()=>setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='razorpay'? 'bg-green-400':''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>
            {/* Cash on delivery */}
            <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='cod'? 'bg-green-400':''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          {/* Place Order */}
          <div className='w-full text-end mt-8'> 
            <button type='submit' className='bg-black active:bg-gray-800 text-white px-16 py-3 rounded-lg text-sm'>PLACE ORDER</button>
          </div> 
          {/* Dont forget to add navigation again ---X---X---*/}

        </div>

      </div>

    </form>
  )
}

export default PlaceOrder