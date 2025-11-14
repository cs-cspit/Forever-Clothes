import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import ConfirmationDialog from '../components/ConfirmationDialog';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate} = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  useEffect(()=>{
    if(products.length>0){
      const tempData = [];
      for(const items in cartItems){ // product
        for(const item in cartItems[items]){ // its size
          if(cartItems[items][item]>0){
            tempData.push({
              _id:items,
              size:item,
              quantity:cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  },[products,cartItems])

  return (
    <div className='border-t pt-8 sm:pt-14 px-2 sm:px-0'>
      <div className='text-xl sm:text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'}/>
      </div>
      <div className='space-y-4'>
        {
          cartData.map((item,index)=>{
            const productData = products.find((product) => product._id === item._id);
            return(
              <div key={index} className='py-3 sm:py-4 border-t border-b text-gray-700 grid grid-cols-[3fr_1fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-2 sm:gap-4'>

                <div className='flex items-start gap-2 sm:gap-5'>
                  <img className='w-14 sm:w-20 rounded-lg' src={productData.image[0]} alt="" />
                  <div>
                    <p className='text-xs sm:text-lg font-medium line-clamp-2 sm:line-clamp-1'>{productData.name}</p>
                    <div className='flex items-center flex-wrap gap-2 sm:gap-5 mt-1 sm:mt-2'>
                      <p className='text-base sm:text-lg'>{currency}{productData.price}</p>
                      <p className='text-sm px-2 sm:px-3 py-0.5 sm:py-1 border bg-slate-50'>{item.size}</p>
                    </div>
                  </div>
                </div>

                <input 
                  onChange={(e)=>e.target.value===' ' || e.target.value==='0'? null:updateQuantity(item._id,item.size,Number(e.target.value))} 
                  className='border w-12 sm:w-20 px-1 sm:px-2 py-1 text-sm sm:text-base' 
                  type="number" 
                  min={1} 
                  defaultValue={item.quantity}
                />

                <img 
                  onClick={() => {
                    setItemToRemove({ id: item._id, size: item.size, name: productData.name });
                    setShowRemoveDialog(true);
                  }} 
                  className='w-4 mr-4 sm:w-5 cursor-pointer' 
                  src={assets.bin_icon} 
                  alt="Remove item" 
                />
              </div>
            )
          })
        }
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        onConfirm={() => {
          if (itemToRemove) {
            updateQuantity(itemToRemove.id, itemToRemove.size, 0);
            setShowRemoveDialog(false);
            setItemToRemove(null);
          }
        }}
        title="Remove Item"
        message={itemToRemove ? `Are you sure you want to remove "${itemToRemove.name}" (Size: ${itemToRemove.size}) from your cart?` : ''}
        confirmText="Remove"
        cancelText="Cancel"
      />

      <div className='flex justify-end my-8 sm:my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full'>
            <button 
              onClick={()=>navigate('/place-order')} 
              className='w-full sm:w-auto float-right bg-black text-white text-sm my-4 sm:my-8 px-4 sm:px-8 py-3 active:bg-gray-800 rounded-lg hover:bg-gray-800 transition-colors'
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart