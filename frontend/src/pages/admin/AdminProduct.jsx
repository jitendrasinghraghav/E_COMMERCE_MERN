import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Edit, Search, Trash2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import axios from 'axios';
import { toast } from 'sonner';
import { setProducts } from '@/redux/productSlice';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const AdminProduct = () => {
    // Standard selector logic
    const { products } = useSelector((state) => state?.product) || { products: [] };
    const [editProduct, setEditProduct] = useState(null)
    const accessToken = localStorage.getItem("accessToken")
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditProduct(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        formData.append("productName", editProduct.productName)
        formData.append("productDesc", editProduct.productDesc)
        formData.append("productPrice", editProduct.productPrice)
        formData.append("category", editProduct.category)
        formData.append("brand", editProduct.brand)

        // Add existing images public_ids
        const exisitingImages = editProduct.productImg
            .filter((img) => !(img instanceof File) && img.public_id)
            .map((img) => img.public_id)

        formData.append("existingImages", JSON.stringify(exisitingImages))

        // Add new files
        editProduct.productImg
            .filter((img) => img instanceof File)
            .forEach((file) => {
                formData.append("files", file)
            })

        try {
            const res = await axios.put(`http://localhost:8000/api/v1/product/update/${editProduct._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (res.data.success) {
                toast.success("Product updated successfully")
                const updateProducts = products.map((p) =>
                    p._id === editProduct._id ? res.data.product : p
                )
                dispatch(setProducts(updateProducts))
                setOpen(false)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteProductHandler = async (productId) => {
        try {
            const remainingProducts = products.filter((product) => product._id !== productId)
            const res = await axios.delete(`http://localhost:8000/api/v1/product/delete/${productId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setProducts(remainingProducts))
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='pl-[350px] py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100'>
            {/* Search and Sort Header */}
            <div className='flex justify-between items-center mb-6'>
                <div className='relative bg-white rounded-lg'>
                    <Input
                        type='text'
                        placeholder="Search Product..."
                        className="w-[400px] pr-10"
                    />
                    <Search className='absolute right-3 top-2.5 text-gray-500 w-5 h-5' />
                </div>
                <Select>
                    <SelectTrigger className="w-[200px] bg-white">
                        <SelectValue placeholder="Sort by Price" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                            <SelectItem value="highToLow">Price: High to Low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Product List */}
            {products && products.length > 0 ? (
                products.map((product, index) => (
                    <Card key={product._id || index} className="p-4 shadow-sm">
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-4 items-center'>
                                <img
                                    src={product.productImg?.[0]?.url || "/placeholder.png"}
                                    alt={product.productName}
                                    className='w-16 h-16 object-cover rounded-md border'
                                />
                                <h1 className='font-bold w-80 text-gray-700 truncate'>
                                    {product.productName}
                                </h1>
                            </div>

                            <h1 className='font-semibold text-gray-800 text-lg'>
                                ₹{product.productPrice}
                            </h1>

                            <div className='flex gap-4 items-center'>
                                {/* Edit Dialog */}
                                <Dialog open={open} onOpenChange={setOpen}>

                                    <DialogTrigger asChild>
                                        <Button onClick={() => { setEditProduct(product), setOpen(true); }} variant="ghost" size="icon" className="text-green-600 hover:text-green-700">
                                            <Edit className='w-5 h-5' />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[625px] w-[95vw] max-h-[90vh] overflow-y-auto outline-none">
                                        <DialogHeader>
                                            <DialogTitle>Edit Product</DialogTitle>
                                            <DialogDescription>
                                                Update the product details below.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="flex flex-col gap-2">
                                            <div className="grid gap-2">
                                                <Label>Product Name</Label>
                                                <Input type="text"
                                                    value={editProduct?.productName}
                                                    onChange={handleChange}
                                                    name="productName" placeholder="EX-Iphone" required />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Price</Label>
                                                <Input type="number"
                                                    value={editProduct?.productPrice}
                                                    onChange={handleChange}
                                                    name="productPrice" required />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label>Brand</Label>
                                                    <Input type="text"
                                                        value={editProduct?.brand}
                                                        onChange={handleChange}
                                                        name="brand" placeholder="Ex-apple" required />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Category</Label>
                                                    <Input type="text"
                                                        value={editProduct?.category}
                                                        onChange={handleChange}
                                                        name="category" placeholder="Ex-mobile" required />
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label>Description</Label>
                                                </div>
                                                <Textarea name="productDesc"
                                                    value={editProduct?.productDesc}
                                                    onChange={handleChange}
                                                    placeholder="Enter brief description of product" />
                                            </div>

                                            <ImageUpload productData={editProduct} setProductData={setEditProduct} />
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button onClick={handleSave} type="submit">Save Changes</Button>
                                        </DialogFooter>
                                    </DialogContent>

                                </Dialog>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                            <Trash2 className='w-5 h-5' />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={()=>deleteProductHandler(product._id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                {/* <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                    <Trash2 className='w-5 h-5' />
                                </Button> */}
                            </div>
                        </div>
                    </Card>
                ))
            ) : (
                <div className="text-center py-20 text-gray-500">No products found.</div>
            )}
        </div>
    );
};

export default AdminProduct;