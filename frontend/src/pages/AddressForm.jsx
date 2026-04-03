import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { addAddress, deleteAddress, setCart, setSelectedAddress } from '@/redux/productSlice'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import {useNavigate } from 'react-router-dom'
import { Contact } from 'lucide-react'

const AddressForm = () => {
    // Initial state for form fields
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    })

    // Getting address data from Redux store
    const { cart, addresses, selectedAddress } = useSelector((store) => store.product)

    // Toggle form visibility based on existing addresses
    const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Handling input changes dynamically
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = () => {
        dispatch(addAddress(formData))
        setShowForm(false)
    }

    const subtotal = cart.totalPrice
    const shipping = subtotal > 50 ? 0 : 10
    const tax = parseFloat((subtotal * 0.05).toFixed(2))
    const total = subtotal + shipping + tax


    const handlePayment = async () => {
        const accessToken = localStorage.getItem("accessToken");
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/create-order`, {
                products: cart?.items?.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                })),
                tax,
                shipping,
                amount: total,
                currency: "INR"
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (!data.success) return toast.error("Something went wrong");

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                order_id: data.order.id, // Order ID from backend
                name: "Your Store Name",
                description: "Test Transaction",
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(
                            `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
                            response,
                            { headers: { Authorization: `Bearer ${accessToken}` } }
                        );

                        if (verifyRes.data.success) {
                            toast.success("✅ Payment Successful!");
                            dispatch(setCart({ items: [], totalPrice: 0 }))
                            navigate("/order-success")
                        } else {
                            toast.error("❌ Payment Verification Failed")
                        }
                    } catch (error) {
                        toast.error("Error verifying payment");
                    }
                },
                modal: {
                    ondismiss: async function () {
                        // Handle user closing the popup
                        await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`, {
                            razorpay_order_id: data.order.id,
                            paymentFailed: true
                        }, {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        }
                        )
                        toast.error("Payment Cancelled or Failed")
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    Contact: formData.phone
                },
                theme: {
                    color: "#F472B6",
                },
            };

            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', async function (response) {
                // Send failure info to backend to update order status to "Failed"
                axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`, {
                    paymentFailed: true,
                    razorpay_order_id: data.order.id,
                }, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                toast.error("Payment Failed. Please try again");
            });

            rzp.open();

        } catch (error) {
            console.log(error);
            toast.error("Something went Wrong while processing payment");
        }
    };


    return (
        <div className='max-w-6xl mx-auto grid place-items-center p-2'>
            <div className='grid grid-cols-2 items-start gap-20 mt-10 max-w-6xl mx-auto'>
                <div className='space-y-4 p-6 bg-white'>
                    {/* Yahan aapke form inputs (Input components) aayenge */}
                    {
                        showForm ? (
                            <>
                                <div>
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="+91 987654321"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        placeholder="123 Street, Agra"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            placeholder="Kolkata"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State</Label>
                                        <Input
                                            id="state"
                                            name="state"
                                            placeholder="Uttar Pradesh"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <Label htmlFor="zip">Zip Code</Label>
                                        <Input
                                            id="zip"
                                            name="zip"
                                            placeholder="70010"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            placeholder="Uttar Pradesh"
                                            value={formData.country}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button onClick={handleSave} className='w-full'>Save & Continue</Button>

                            </>
                        ) : (
                            <div className='space-y-2'>
                                <h2 className='text-lg font-semibold'>Save Addresses</h2>
                                {
                                    addresses.map((addr, index) => {
                                        return <div
                                            key={index}
                                            onClick={() => dispatch(setSelectedAddress(index))}
                                            className={`relative border-2 p-4 rounded-md cursor-pointer transition-all ${selectedAddress === index
                                                ? "border-pink-500 bg-pink-50 shadow-sm" // Highlight visible karne ke liye darker border aur bg
                                                : "border-gray-300 hover:border-gray-400"
                                                }`}
                                        >
                                            <p className='font-medium'>{addr.fullName}</p>
                                            <p>{addr.phone}</p>
                                            <p>{addr.email}</p>
                                            <p>{addr.address},{addr.city},{addr.state},{addr.zip},{addr.country}</p>
                                            <button onClick={(e) => dispatch(deleteAddress(index))} className='absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm'>
                                                Delete
                                            </button>
                                        </div>
                                    })
                                }
                                <Button variant='outline' className='w-full' onClick={() => setShowForm(true)}>+ Add New Address</Button>
                                <Button 
                                onClick={handlePayment}
                                disabled={selectedAddress === null} className="w-full bg-pink-600">Procced to Checkout</Button>
                            </div>
                        )
                    }
                </div>

                {/* Right Side Order Summary */}
                <div>
                    <Card className="w-[400px]">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal ({cart?.items?.length} items)</span>
                                <span>₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{shipping}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>₹{tax}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{total}</span>
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
        </div >
    )
}

export default AddressForm