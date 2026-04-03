import razorpayInstance from "../config/razorpay.js";
import { Cart } from "../models/cartModel.js";
import { Order } from "../models/orderModel.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency } = req.body;

        const options = {
            amount: Math.round(Number(amount) * 100), // convert to paise
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        // Save order in DB
        const newOrder = new Order({
            user: req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency,
            status: "Pending",
            razorpayOrderId: razorpayOrder.id
        });

        await newOrder.save();

        res.json({
            success: true,
            order: razorpayOrder,
            dbOrder: newOrder
        });

    } catch (error) {
        console.error("❌ Error in create Order:", error);
        res.status(500).json({ success: false,message:error.message });
    }
};


// 1. Create Order (Razorpay Order Generation)
export const placeOrder = async (req, res) => {
    try {
        const { products, amount, address } = req.body;

        const options = {
            amount: Number(amount * 100), // amount in paise
            currency: "INR",
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(201).json({
            success: true,
            order,
            products,
            address
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body;
    const userId = req.user._id;

    if (paymentFailed) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { returnDocument: 'after' }
      );
      return res.status(400).json({ success: false, message: "Payment failed", order });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          status: "Paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        {  returnDocument: 'after'}
      );

      // Clear the user's cart after successful payment
      await Cart.findOneAndUpdate({ userId:userId },{$set: { items: [], totalPrice: 0 }});

      return res.status(200).json({ success: true, message: "Payment verified successfully", order });
    } else {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id},
        {status:"Failed"},
        { returnDocument: 'after'}
      );
      return res.status(400).json({success:false, message:"Invalid Signature"})
    }
  } catch (error) {
    console.error("Erroe in verify Payment",error);
    
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getMyOrder = async (req, res) => {
  try {
    const userId = req.id;
    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      })
      .populate("user", "firstName lastName email");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: error.message });
  }
};