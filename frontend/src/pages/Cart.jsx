import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import userLogo from '../assets/userLogo.png'
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator'; // ✅ Sahi tarika
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCart } from '@/redux/productSlice'; // Apne sahi path se import karo
import { toast } from 'sonner';


const Cart = () => {
  const { cart } = useSelector(store => store.product);
  const navigate = useNavigate();

  const subtotal = cart?.totalPrice
  const shipping = subtotal > 299 ? 0 : 10
  const tax = subtotal * 0.05 //5%
  const total = subtotal + shipping + tax
  const dispatch = useDispatch()

  const API = "http://localhost:8000/api/v1/cart"
  const accessToken = localStorage.getItem("accessToken")


  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error);
    }
  }


  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API}/update`, { productId, type }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error);
    }
  }


  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        // 🚩 Galti yahan thi: data key ke andar productId bhejna hoga
        data: { productId },
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true // Cookies ke liye safe side rakho
      });

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        // Tip: toast ko import zaroori hai agar use kar rahe ho
        // toast.success('Product removed from cart'); 
      }
    } catch (error) {
      console.error("Remove Error:", error.response?.data || error.message);
    }
  };



  useEffect(() => {
    loadCart()
  }, [dispatch])


  return (
    <div className='pt-20 bg-gray-50 min-h-screen'>
      {cart?.items?.length > 0 ?
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-2xl font-bold text-gray-800 mb-7 ms-20'>Shopping Cart</h1>
          <div className='max-w-6xl mx-auto flex gap-7'>
            <div className='flex flex-col gap-5 flex-1'>
              {cart?.items?.map((item, index) => (
                <Card key={index}>
                  <div className="flex justify-between items-center pr-7">
                    <div className='flex items-center w-[350px] gap-10'>
                      <img
                        src={item?.productId?.productImg?.[0]?.url || userLogo}
                        className="w-25 h-25 object-cover"
                      />
                      <div className='w-[280px]'>
                        <h1 className="font-semibold truncate">{item?.productId?.productName}</h1>
                        <p></p>
                        <p>₹{item?.price}</p>
                      </div>
                    </div>
                    <div className='flex gap-5 items-center'>
                      <Button onClick={() => handleUpdateQuantity(item?.productId?._id, 'decrease')} variant='outline'>-</Button>
                      <span>{item?.quantity}</span>
                      <Button onClick={() => handleUpdateQuantity(item?.productId?._id, 'increase')} variant='outline'>+</Button>
                    </div>
                    <p>₹{(item?.price) * (item?.quantity)}</p>
                    <p onClick={() => handleRemove(item?.productId?._id)} className='flex text-red-500 items-center gap-1 cursor-pointer'><Trash2 className='w-4 h-4' />Remove</p>
                  </div>
                </Card>
              ))}
            </div>
            {/* <Card className='w-[400px]'>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between'>
                  <span>Subtotal ({cart?.items?.length} items)</span>
                  <span>₹{cart?.totalPrice?.toLocaleString('en-IN')}</span>
                </div>


                <div className='flex justify-between'>
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>

                <div className='flex justify-between'>
                  <span>Tax(5%)</span>
                  <span>₹{tax}</span>
                </div>

                <Separator />

                <div className='flex justify-between font-bold text-lg'>
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <div className='space-y-3 pt-4'>
                  <div className='flex space-x-2'>
                    <Input placeholder="Promo Code" />
                    <Button variant='outline'>Apply</Button>
                  </div>
                  <Button className='w-full bg-pink-600'>PLACE ORDER</Button>
                </div>

              </CardContent>
            </Card> */}

            {/* Order Summary Card */}
            <Card className='w-[400px] h-fit top-24'>
              {/* h-fit se ye niche tak nahi jayega, aur sticky top-24 se scroll ke saath move karega */}
              <CardHeader>
                <CardTitle className="text-xl font-bold border-b pb-2">Order Summary</CardTitle>
              </CardHeader>

              <CardContent className='space-y-4'>
                {/* Subtotal Section */}
                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal ({cart?.items?.length} items)</span>
                  <span className='font-medium text-gray-900'>₹{cart?.totalPrice?.toLocaleString('en-IN')}</span>
                </div>

                {/* Shipping Section */}
                <div className='flex justify-between text-gray-600'>
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "text-gray-900"}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>

                {/* Tax Section */}
                <div className='flex justify-between text-gray-600'>
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <Separator className="my-2" />

                {/* Grand Total - Invoice Look */}
                <div className='flex justify-between items-center py-2'>
                  <span className='text-lg font-bold text-gray-800'>Total Amount</span>
                  <span className='text-2xl font-extrabold text-pink-600'>
                    ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Promo & Button Section */}
                <div className='space-y-4 pt-4'>
                  <div className='flex space-x-2'>
                    <Input placeholder="Promo Code" className="focus-visible:ring-pink-500" />
                    <Button variant='outline' className="hover:bg-gray-100">Apply</Button>
                  </div>

                  <Button onClick={()=>navigate('/address')} className='w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-6 text-lg shadow-lg transition-all active:scale-95'>
                    PLACE ORDER
                  </Button>
                  <Button variant='outline' className='w-full bg-transparent'>
                    <Link to='/products'>Continue Shopping</Link>
                  </Button>

                  {/* <p className='text-xs text-center text-gray-500'>
                    Secure Checkout • Fast Delivery
                  </p> */}
                </div>
                <div className='text-sm text-muted-foreground pt-4'>
                  <p>* Free shipping on orders over 299</p>
                  <p>* 30-days return policy</p>
                  <p>* Secure checkout with SSL encryption</p>
                </div>
              </CardContent>
            </Card>






          </div>
        </div>
        : <div className='flex flex-col items-center justify-center min-h[60vh] p-6 text-center'>
          {/* Icon */}
          <div className='bg-pink-100 p-6 rounded-full'>
            <ShoppingCart className='w-16 h-16 text-pink-600' />
          </div>
          {/* tittle */}
          <h2 className='mt-6 text-2xl font-bold text-gray-800'>Your Cart is Empty</h2>
          <p className='mt-2 text-gray-600'>Looks like you haven't added anything to your cart yet</p>
          <Button onClick={() => navigate('/products')} className='mt-6 cursor-pointer bg-pink-600 text-white py-3 px-6 hover:bg-pink-700'>Start Shopping</Button>
        </div>
      }
    </div>
  );
};

export default Cart