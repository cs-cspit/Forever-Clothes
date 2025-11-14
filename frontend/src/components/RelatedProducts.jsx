import { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const RelatedProducts = ({category}) => {
    const {products} = useContext(ShopContext);
    const [related,setRelated] = useState([]);

    useEffect(()=>{
        if(products.length > 0){
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item)=>(category === item.category));
            setRelated(productsCopy.slice(0,5));
        }
    },[products, category])

RelatedProducts.propTypes = {
    category: PropTypes.string.isRequired
};

  return (
    <div className='my-24'>
        <div className='text-center text-3xl py-2'>
            <Title text1={'RELATED'} text2={'PRODUCTS'}/>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols4 lg:grid-cols-5 gap-4 gap-y6'>
            {related.map((item,index)=>(
                <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} quantity={item.quantity} />
            ))}
        </div>
    </div>
  )
}

export default RelatedProducts