import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products,currency,addToCart } = useContext(ShopContext);
  const [productData,setProductData] = useState(false);
  const [image,setImage] = useState('');
  const [size,setSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Function to handle quantity change
  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const max = productData && typeof productData.quantity !== 'undefined' ? Number(productData.quantity) : Infinity;
      const newQuantity = prev + change;
      if (newQuantity < 1) return 1;
      if (newQuantity > max) return max;
      return newQuantity;
    });
  };

  // Function to sort sizes in order: S, M, L, XL, XXL
  const sortSizes = (sizes) => {
    const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL'];
    return sizes.sort((a, b) => {
      const indexA = sizeOrder.indexOf(String(a));
      const indexB = sizeOrder.indexOf(String(b));
      // If size not found in order, put it at the end
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  const fetchProductData = async ()=>{
    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      // Make sure there is at least one image
      if (product.image && product.image.length > 0) {
        setImage(product.image[0]);
      }
    }
  }

  useEffect(()=>{
    fetchProductData();
    // Scroll to top when product page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },[products,productId])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>

      {/* -----------------------------------Product Data------------------------------------------------ */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/* -----------------Product Images------------------ */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          {/* Small images */}
          <div className='flex flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image && productData.image.length > 0 && productData.image.map((item, index) => (
              item && (
                <img 
                  onClick={() => setImage(item)} 
                  src={item} 
                  key={index} 
                  className='w-[24%] sm:w-full sm:mb-3 flex-shink-0 cursor-pointer rounded-lg' 
                  alt={`Product view ${index + 1}`}
                />
              )
            ))}
          </div>
          {/* Big image */}
          <div className='w-full sm:w-[80%]'>
            {image ? (
              <img className='w-full h-auto rounded-lg' src={image} alt="Product main view" />
            ) : (
              <div className='w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center'>
                <span className='text-gray-400'>No image available</span>
              </div>
            )}
          </div>
        </div>

        {/* ----------------Product information------------------ */}
        <div className='flex-1'>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            <div className='flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3.5" />
              <img src={assets.star_icon} alt="" className="w-3.5" />
              <img src={assets.star_icon} alt="" className="w-3.5" />
              <img src={assets.star_icon} alt="" className="w-3.5" />
              <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            </div>
            <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
            <p className='mt-1 text-sm text-gray-600'>Available: {typeof productData.quantity !== 'undefined' ? productData.quantity : 'N/A'}</p>
            <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
            <div className='flex flex-col gap-4 my-8'>
              <p>Select Size</p>
              <div className='flex gap-2 flex-wrap'>
                {sortSizes([...productData.sizes]).map((item,index)=>(
                  <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item===size? 'border-blue-400 bg-blue-50':''} rounded transition-colors duration-200 hover:bg-gray-200`} key={index}>{item}</button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className='flex flex-col gap-4 mb-8'>
              <p>Select Quantity</p>
              <div className='flex items-center gap-4'>
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className='border h-8 w-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition-colors'
                >
                  -
                </button>
                <span className='text-lg'>{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className='border h-8 w-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition-colors'
                >
                  +
                </button>
              </div>
            </div>

            <button 
              onClick={() => addToCart(productData._id, size, quantity)}
              className={`px-8 py-3 text-sm rounded-lg ${productData.quantity > 0 ? 'bg-gray-800 text-white active:bg-gray-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              disabled={productData.quantity <= 0}
            >
              {productData.quantity > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
            </button>
            <hr className='mt-8 sm:w-4/5'/>
            <div className='text-small text-gray-500 flex flex-col gap-1 mt-4'>
              <p>100% Original product</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
            </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------------------------------- */}

      {/* --------------------------Description & review Section--------------------------------------- */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>Discover the perfect blend of comfort and fashion with our product. Made from high-quality fabric type, this piece offers a soft, breathable feel while ensuring durability for everyday wear. Designed with [key design features, e.g., a tailored fit, stylish patterns, or unique details], it effortlessly complements any wardrobe. Whether you're dressing up for an occasion or keeping it casual, this versatile piece is a must-have. Available in multiple colors and sizes to suit your style.</p>
          <p>Upgrade your wardrobe with our product, designed for those who appreciate both style and comfort. Crafted from premium fabric type, this piece provides a soft touch against your skin while ensuring durability and breathability. The modern fit and timeless design make it perfect for any occasion—whether you're dressing up or keeping it casual.</p>
        </div>
      </div>

      {/* ------------------------------Display related products---------------------------------------- */}
      <RelatedProducts category={productData.category}/>

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product