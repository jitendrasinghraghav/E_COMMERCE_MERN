import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();

const connectDB = async()=>{
    try{
         
        await mongoose.connect(`${process.env.MONGO_URI}e-commerce-mern`)
        console.log('MongoDB connected successfully')

    }catch(error){
        console.log("MongoDB connection failed:",error);
    }
}

export default connectDB