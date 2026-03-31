import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import { useSelector } from 'react-redux';
import userLogo from '../assets/userLogo.png'
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';


const Cart = () => {
  const { cart } = useSelector(store => store.product);

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
                      <Button variant='outline'>-</Button>
                      <span>1</span>
                      <Button variant='outline'>+</Button>
                    </div>
                    <p>₹{(item?.price)*(item?.quantity)}</p>
                    <p className='flex text-red-500 items-center gap-1 cursor-pointer'><Trash2 className='w-4 h-4'/>Remove</p>
                  </div>
                </Card>
              ))}
            </div>
            <Card className='w-[400px]'>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between'>
                  <span>Subtotal ({cart?.items?.length} items)</span>
                  <span>₹{cart?.totalPrice?.toLocaleString('en-IN')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      : <p className="text-center">Cart is empty</p>}
    </div>
  );
};

export default Cart