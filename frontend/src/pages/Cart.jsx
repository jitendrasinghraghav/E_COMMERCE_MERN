import { Card } from '@/components/ui/card';
import React from 'react'
import { useSelector } from 'react-redux';

const Cart = () => {
  const { cart } = useSelector(store => store.product);

  return (
    <div className='pt-20 bg-gray-50 min-h-screen'>
      {cart?.items?.length > 0 ? (
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-2xl font-bold text-gray-800 mb-7'>Shopping Cart</h1>
          <div className='flex gap-7'>
            <div className='flex flex-col gap-5 flex-1'>
              {cart.items.map((item, index) => (
                <Card key={index} className="flex justify-between items-center p-4 pr-7">
                  <div className='flex items-center w-[350px] gap-4'>
                    <img 
                      src={item?.productId?.productImg?.[0]?.url || userLogo} 
                      className="w-20 h-20 object-cover" 
                    />
                    <div>
                       <p className="font-bold">{item?.productId?.productName}</p>
                       <p>₹{item.price}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : <p className="text-center">Cart is empty</p>}
    </div>
  );
};

export default Cart