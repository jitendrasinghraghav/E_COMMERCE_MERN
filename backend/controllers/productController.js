import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const addProduct = async (req, res) => {
    try {
        const { productName, productDesc, productPrice, category, brand } = req.body;
        const userId = req.id;

        if (!productName || !productDesc || !productPrice || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Handle multiple image uploads
        let productImg = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "mern_products" // cloudinary folder name
                });

                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }

        // create a product in DB
        const newProduct = await Product.create({
            userId,
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            productImg, // array of objects [{url, public_id}, {url, public_id}]
        });

        return res.status(200).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllProduct = async (_, res) => {
    try {
        const products = await Product.find();
        
        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No product available",
                products: []
            });
        }

        return res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // 1. Find product in DB
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // 2. Delete images from Cloudinary
        // productImg ek array hai, isliye loop chalayenge
        if (product.productImg && product.productImg.length > 0) {
            for (let img of product.productImg) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        // 3. Delete product from MongoDB
        await Product.findByIdAndDelete(productId);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { productName, productDesc, productPrice, category, brand, existingImages } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        let updatedImages = [];

        // 1. Keep selected old images (Logic from Image 1)
        if (existingImages) {
            const keepIds = JSON.parse(existingImages); // Array of public_ids to keep
            updatedImages = product.productImg.filter((img) => 
                keepIds.includes(img.public_id)
            );

            // Delete removed images from Cloudinary (Logic from Image 2)
            const removedImages = product.productImg.filter(
                (img) => !keepIds.includes(img.public_id)
            );

            for (let img of removedImages) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        } else {
            // Agar koi existingImages nahi bheji, toh purani sab rakhein
            updatedImages = product.productImg;
        }

        // 2. Upload new images if any (Logic from Image 2)
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "mern_products"
                });

                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }

        // 3. Update product fields and save (Logic from Image 3)
        product.productName = productName || product.productName;
        product.productDesc = productDesc || product.productDesc;
        product.productPrice = productPrice || product.productPrice;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.productImg = updatedImages;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};