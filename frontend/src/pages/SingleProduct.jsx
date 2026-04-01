import Breadcrums from '@/components/Breadcrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import store from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleProduct = () => {
    const params = useParams()
    const productId = params.id
    const { products } = useSelector(store => store.product)
    const product = products.find((item) => item._id === productId)
    console.log(product)
    return (
        <div className='pt-20 py-10 max-w-5xl mx-auto'>
            <Breadcrums product={product} />
            <div className='mt-8 grid grid-cols-2 gap-35 items-start'>
                <ProductImg images={product?.productImg} />
                <ProductDesc product={product} />
            </div>
        </div>
    )
}

export default SingleProduct