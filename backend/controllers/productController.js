import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js'

// function for add product------------------------------------------------------------
const addProduct = async(req,res)=>{
    try{
        const {name,description,price,category,subCategory,sizes,bestseller,quantity} = req.body;
        console.log("Category:", category);
        const image1 = req.files.image1 && req.files.image1[0]; //here, if image1 is provided by admin then next condition will executed
        const image2 = req.files.image2 && req.files.image2[0]; //and image1[0] conatins the binary string format of image1
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const images = [image1,image2,image3,image4].filter((item)=> item!==undefined);

        //convert images into secure urls
        let imageUrl = await Promise.all(
            images.map(async(item) => {
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'}); //result contain secure image url
                return result.secure_url;
            })
        )
        
        //uplod image urls in MongoDB database
        const productData = {
            name,
            description,
            category,
            subCategory,
            price: Number(price),
            quantity: Number(quantity) || 0,
            bestseller: bestseller==="true"? true:false,
            sizes: JSON.parse(sizes),
            image:imageUrl,
            date: Date.now()
        }
        console.log(productData);
        const product = new productModel(productData);
        await product.save();
        res.json({success:true, message:"Product added"});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error in add product : "+error.message});
    }
}

// function for list product------------------------------------------------------------
const listProducts = async(req,res)=>{
    try{
        const products = await productModel.find({});
        res.json({success:true, products});
    } 
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

// function for remove product----------------------------------------------------------
const removeProduct = async(req,res)=>{
    try{
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Product removed"});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

// function for single product info-----------------------------------------------------
const singleProduct = async(req,res)=>{
    try{
        const {productId} = req.body;
        const product = await productModel.findById(productId);
        res.json({success:true,product});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

// function for update product----------------------------------------------------------
const updateProduct = async(req,res)=>{
    try {
    const {id, name, description, price, category, sizes, bestseller, existingImages, quantity} = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const newImages = [image1, image2, image3, image4].filter(item => item !== undefined);

        // Parse existing images array
        const existingImagesArray = JSON.parse(existingImages || '[]');

        let finalImageUrls = [...existingImagesArray]; // Start with existing images

        // Upload new images to cloudinary
        if (newImages.length > 0) {
            const newImageUrls = await Promise.all(
                newImages.map(async (item) => {
                    const result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                    return result.secure_url;
                })
            );

            // Fill in the gaps or append new images
            let newImageIndex = 0;
            for (let i = 0; i < 4; i++) {
                if (finalImageUrls[i] === null && newImageUrls[newImageIndex]) {
                    finalImageUrls[i] = newImageUrls[newImageIndex];
                    newImageIndex++;
                }
            }

            // Append any remaining new images
            while (newImageIndex < newImageUrls.length) {
                if (finalImageUrls.length < 4) {
                    finalImageUrls.push(newImageUrls[newImageIndex]);
                }
                newImageIndex++;
            }
        }

        // Remove null values and keep only valid URLs
        finalImageUrls = finalImageUrls.filter(url => url !== null);

        let updateData = {
            name,
            description,
            category,
            price: Number(price),
            quantity: Number(quantity) || 0,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: finalImageUrls
        };

        // If there are no images left, prevent the update
        if (finalImageUrls.length === 0) {
            return res.json({
                success: false, 
                message: "Product must have at least one image"
            });
        }

        const product = await productModel.findByIdAndUpdate(id, updateData, {new: true});
        res.json({success: true, message: "Product updated", product});
    }
    catch(error) {
        console.log(error);
        res.json({success: false, message: "Error in update product : " + error.message});
    }
}

export {addProduct,listProducts,removeProduct,singleProduct,updateProduct}