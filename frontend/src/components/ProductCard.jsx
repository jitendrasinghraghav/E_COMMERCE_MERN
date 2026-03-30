import { ShoppingCart } from 'lucide-react';
import React from 'react'
import { Button } from './ui/button';
import { Skeleton } from "@/components/ui/skeleton"
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setCart } from '@/redux/productSlice';

const ProductCard = ({ product, loading }) => {
  // Safe destructuring: loading ke waqt data nahi hoga isliye optional chaining ya check zaroori hai
  // const {productImg, productPrice, productName}=product
  const productImg = product?.productImg;
  const productPrice = product?.productPrice;
  const productName = product?.productName;
  const product_id = product?._id;
  const accessToken = localStorage?.getItem('accessToken')
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const addToCart = async (productId) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/cart/add`, { productId }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        toast.success('Product added to Cart')
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      
      console.error(error)
    }
  }



  return (
    <div className='shadow-lg rounded-lg overflow-hidden h-max'>
      <div className='w-full h-full aspect-square overflow-hidden'>
        {
          loading ? (
            <Skeleton className='w-full h-full rounded-lg' />
          ) : (
            <img
              src={productImg?.[0]?.url}
              alt={productName}
              className='w-full h-full transition-transform duration-300 hover:scale-105'
            />
          )
        }
      </div>

      {
        loading ? (
          <div className='px-2 space-y-2 my-2'>
            <Skeleton className='w-50 h-4' />
            <Skeleton className='w-25 h-4' />
            <Skeleton className='w-37.5 h-9' />
          </div>
        ) : (
          <div className='px-2 space-y-1'>
            <h1 className='font-semibold h-12 line-clamp-2'>{productName}</h1>
            <h2 className='font-bold'>₹{productPrice}</h2>
            <Button onClick={()=>addToCart(product_id)} className="bg-pink-600 mb-3 w-full">
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        )
      }
    </div>
  )
}

export default ProductCard