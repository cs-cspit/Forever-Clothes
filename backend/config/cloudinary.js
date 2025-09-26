import {v2 as cloudinary} from "cloudinary"
<<<<<<< HEAD
import { connect } from "mongoose"

const connectCloudinary = async () => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    })
}

export default connectCloudinary;
=======

const connectCloudinary = async()=>{
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key : process.env.CLOUDINARY_API_KEY,
            api_secret : process.env.CLOUDINARY_SECRET_KEY
        })
    } 
    catch(error){
        console.log(`ERROR in cloudinary : ${error}`)
    }
}

export default connectCloudinary
>>>>>>> 461b493 (Admin dashboard changes)
