import React, { useState, useEffect } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({ images = [] }) => { // Default empty array taaki map crash na ho
    // State ko initial null ya empty string rakhein
    const [mainImg, setMainImg] = useState("");

    // Jab bhi images prop change ho, pehli image ko main image set karein
    useEffect(() => {
        if (images?.length > 0) {
            setMainImg(images[0].url);
        }
    }, [images]);

    // Agar images nahi hain toh loading ya placeholder dikhayein
    if (!images || images.length === 0) {
        return <div className='w-20 h-20 bg-gray-200 animate-pulse'>No Image</div>;
    }

    return (
        <div className='flex gap-5 w-max'>
            <div className='gap-3 flex flex-col'>
                {
                    images.map((img, index) => (
                        <img
                            key={index} // Key dena mat bhoolna bhai
                            onClick={() => setMainImg(img.url)}
                            src={img?.url}
                            alt="thumbnail"
                            className={`cursor-pointer w-20 h-20 border shadow-lg object-cover ${mainImg === img.url ? 'border-pink-500 border-2' : ''}`}
                        />
                    ))
                }
            </div>
            <Zoom>
                <img
                    src={mainImg || images[0]?.url}
                    alt="main-product"
                    className='w-[450px] h-[450px] object-cover border shadow-lg'
                />
            </Zoom>
        </div>
    )
}

export default ProductImg