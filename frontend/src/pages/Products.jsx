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
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/store';
import { setProducts } from '@/redux/productSlice';

const Products = () => {
    const { products} = useSelector(store => store.product)

    // 2. State definition
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [brand, setBrand] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 999999])
    const [sortOrder, setSortOrder] = useState('')


    const dispatch = useDispatch()

    // 3. API function
    const getAllProducts = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`http://localhost:8000/api/v1/product/getallproduct`);
            if (res.data.success) {
                setAllProducts(res.data.products);
                dispatch(setProducts(res.data.products))
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        if (allProducts.length === 0) return;

        let filtered = [...allProducts];

        if (search.trim() !== "") {
            filtered = filtered.filter(p =>
                p.productName?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category !== "All") {
            filtered = filtered.filter(p => p.category === category);
        }

        if (brand !== "All") {
            filtered = filtered.filter(p => p.brand === brand);
        }

        filtered = filtered.filter(p =>
            p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
        );

        if (sortOrder === "lowToHigh") {
            filtered.sort((a, b) => a.productPrice - b.productPrice);
        } else if (sortOrder === "highToLow") {
            filtered.sort((a, b) => b.productPrice - a.productPrice);
        }

        dispatch(setProducts(filtered));
    }, [search, category, brand, priceRange, sortOrder, allProducts, dispatch]);


    // 4. useEffect to call API on mount
    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <div className='pt-18 pb-10'>
            <div className='max-w-6xl mx-auto flex gap-7'>
                {/* Sidebar */}
                <FilterSidebar
                    search={search}
                    setSearch={setSearch}
                    brand={brand}
                    setBrand={setBrand}
                    category={category}
                    setCategory={setCategory}
                    allProducts={allProducts}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                />

                {/* Main product section */}
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-end mb-4'>
                        <Select onValueChange ={(value)=>setSortOrder(value)}>
                            <SelectTrigger className="w-50">
                                <SelectValue placeholder="Sort by Price" />
                            </SelectTrigger>
                            <SelectContent position="popper" sideOffset={4}>
                                <SelectGroup>
                                    <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                                    <SelectItem value="highToLow">Price: High to Low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Product Mapping logic */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
                        {/* {
                           
                                allProducts.map((product) => {
                                    // 5. ProductCard mein 'product' prop pass karna mat bhulna
                                    return <ProductCard key={product._id} product={product} loading={loading} />
                                })
                             
                            
                        } */}


                        {
                            loading ? (
                                // Loading ke waqt 5 skeleton cards dikhao
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                                    <ProductCard key={index} loading={true} />
                                ))
                            ) : products && products.length > 0 ? (
                                products.map((product) => (
                                    <ProductCard key={product._id} product={product} loading={false} />
                                ))
                            ) : (
                                // Ye tabhi dikhega jab loading khatam ho jaye aur products na milein
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