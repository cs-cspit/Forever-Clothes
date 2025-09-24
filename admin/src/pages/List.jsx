import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({token}) => {

  const [list,setList] = useState([])
  const [editProductId, setEditProductId] = useState('')
  const [editValues, setEditValues] = useState({ name: '', category: '', price: '' })

  const fetchList = async() => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if(response.data.success){
      setList(response.data.products)
    }
    else{
      toast.error(response.data.message)
    }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      
      const response = await axios.post(backendUrl + '/api/product/remove',{id},{headers:{token}})

      if(response.data.success){
        toast.success(response.data.message)
        await fetchList()    //to fetch updated list
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const startEdit = (item) => {
    setEditProductId(item._id)
    const allowed = ['Men','Women','Kids']
    const normalizedCategory = allowed.includes(item.category) ? item.category : 'Men'
    setEditValues({ name: item.name || '', category: normalizedCategory, price: item.price ?? '' })
  }

  const cancelEdit = () => {
    setEditProductId('')
    setEditValues({ name: '', category: '', price: '' })
  }

  const saveEdit = async () => {
    try {
      const payload = {
        id: editProductId,
        name: editValues.name,
        category: editValues.category,
        price: editValues.price
      }
      const response = await axios.put(backendUrl + '/api/product/update', payload, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        cancelEdit()
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchList()
  },[])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* --------- List Table Title --------- */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>
        {/* --------- Product List --------- */}
        {list.map((item,index)=>{
          const isEditing = editProductId === item._id
          return (
            <div className='grid grid-cols-[1fr_3fr_1r] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12' src={item.image[0]} alt="" />
              {isEditing ? (
                <input className='px-2 py-1 border' value={editValues.name} onChange={(e)=>setEditValues(v=>({...v, name: e.target.value}))} />
              ) : (
                <p>{item.name}</p>
              )}
              {isEditing ? (
                <select className='px-2 py-1 border' value={editValues.category} onChange={(e)=>setEditValues(v=>({...v, category: e.target.value}))}>
                  <option value='Men'>Men</option>
                  <option value='Women'>Women</option>
                  <option value='Kids'>Kids</option>
                </select>
              ) : (
                <p>{item.category}</p>
              )}
              {isEditing ? (
                <input className='px-2 py-1 border' type='number' value={editValues.price} onChange={(e)=>setEditValues(v=>({...v, price: e.target.value}))} />
              ) : (
                <p>{currency}{item.price}</p>
              )}
              {isEditing ? (
                <div className='flex justify-end md:justify-center gap-2'>
                  <button onClick={saveEdit} className='px-2 py-1 border bg-green-500 text-white'>Save</button>
                  <button onClick={cancelEdit} className='px-2 py-1 border'>Cancel</button>
                </div>
              ) : (
                <div className='flex justify-end md:justify-center gap-3'>
                  <button onClick={()=>startEdit(item)} className='px-2 py-1 border'>Edit</button>
                  <p onClick={()=>removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default List