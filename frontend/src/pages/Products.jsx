import React, { useEffect, useState } from 'react'; // 1. useState import karna zaroori hai
import FilterSidebar from '@/components/FilterSidebar';
import axios from 'axios'; // axios import check karein
import { toast } from 'sonner'; // ya toast library jo aap use kar rahe ho
import ProductCard from '@/components/ProductCard';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Products = () => {
    // 2. State definition
    const [allProducts, setAllProducts] = useState([]);
    const [loading,setLoading] = useState(false)

    // 3. API function
    const getAllProducts = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`http://localhost:8000/api/v1/product/getallproduct`);
            if (res.data.success) {
                setAllProducts(res.data.products);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally{
            setLoading(false)
        }
    };

    // 4. useEffect to call API on mount
    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <div className='pt-18 pb-10'>
            <div className='max-w-6xl mx-auto flex gap-7'>
                {/* Sidebar */}
                <FilterSidebar />
                
                {/* Main product section */}
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-end mb-4'>
                        <Select>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Sort by Price" />
                            </SelectTrigger>
                            <SelectContent position="popper" sideOffset={4}>
                                <SelectGroup>
                                    <SelectItem value="lowtoHigh">Price: Low to High</SelectItem>
                                    <SelectItem value="hightoLow">Price: High to Low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Product Mapping logic */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
                        {
                            allProducts && allProducts.length > 0 ? (
                                allProducts.map((product) => {
                                    // 5. ProductCard mein 'product' prop pass karna mat bhulna
                                    return <ProductCard key={product._id} product={product} loading={loading} />
                                })
                            ) : (
                                <p>No products available</p>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;