import {v2 as cloudinary} from 'cloudinary'
import 'dotenv/config'

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.api_key,
    api_secret: process.env.API_SECRET
})

export default cloudinary