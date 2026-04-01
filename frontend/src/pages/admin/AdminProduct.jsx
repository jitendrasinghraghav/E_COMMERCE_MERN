import { Input } from '@/components/ui/input'
import { Edit, Search, Trash2 } from 'lucide-react'
import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSelector } from 'react-redux'
import store from '@/redux/store'
import { Card } from '@/components/ui/card'

const AdminProduct = () => {
    const { products } = useSelector(store => store?.product)
    console.log(products)
    return (
        <div className='pl-[350px] py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100'>
            <div className='flex justify-between'>
                <div className='relative bg-white rounded-lg'>
                    <Input
                        type='text'
                        placeholder="Search Product..."
                        className="w-[400px] items-center"
                    />
                    <Search className='absolute right-3 top-1.5 text-gray-500' />
                </div>
                <Select>
                    <SelectTrigger className="w-[200px] bg-white">
                        <SelectValue placeholder="Sort by Price" />
                    </SelectTrigger>
                    <SelectContent className='mt-9'>
                        <SelectGroup>
                            <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                            <SelectItem value="highToLow">Price: High to Low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {
                products.map((product, index) => {
                    return (
                        <Card key={index} className="px-4">
                            <div className='flex items-center justify-between'>
                                <div className='flex gap-2 items-center'>
                                    <img
                                        src={product.productImg[0]?.url}
                                        alt=""
                                        className='w-25 h-25 object-cover'
                                    />
                                    <h1 className='font-bold w-96 text-gray-700'>
                                        {product.productName}
                                    </h1>
                                </div>

                                <h1 className='font-semibold text-gray-800'>
                                    ₹{product.productPrice}
                                </h1>

                                <div className='flex gap-3'>
                                    <Edit className='text-green-500 cursor-pointer' />
                                    <Trash2 className='text-red-500 cursor-pointer' />
                                </div>
                            </div>
                        </Card>
                    )
                })
            }
        </div>
    )
}

export default AdminProduct