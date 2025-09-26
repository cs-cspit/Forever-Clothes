<<<<<<< HEAD
import bcrypt from "bcrypt"
import validator from "validator"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

//route for user login
const loginUser = async (req,res) => {
    try{
        const {email, password} = req.body
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false, message:"User Doen Not Exist With This Email Address"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch){
            const token  = createToken(user._id)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid Password"})
        }
    }
    catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//route for user register
const registerUser = async (req,res) => {
    try{
        const {name, email, password} = req.body

        //checking if user is already exist or not?
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success:false, message:"User With This Email Address Already Exist"})
        }

        //validate the email and password
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please Enter A Valid Email"})
        }
        if(password.length < 8){
            return res.json({success:false, message:"Please Enter A Strong Password"})
        }

        //account creation and store hashed password in database
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
=======
import userModel from "../models/userModel.js";
import validator from "validator"; //for email validator
import bcrypt from "bcrypt"; //for password bcrypt
import jwt from 'jsonwebtoken'; //for token
import dotenv from 'dotenv';
dotenv.config();
// require('dotenv').config();


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login-------------------------------------------------
const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({message:"Invalid email"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = createToken(user._id);
            return res.json({success:true, token});
        }else{
            return res.json({success:false, message:"Invalid password"});
        }
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

// Route for user register-----------------------------------------------
const registerUser = async(req,res)=>{
    try{
        const {name,email,password} = req.body;

        //checking user already exist or not
        const exist = await userModel.findOne({email});
        if(exist){
            return res.json({success:false, message:"User already exist"});
        }

        // Validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter a valid email"});
        }
        if(password.length < 8){
            return res.json({success:false, message:"Please enter a strong password(more then 8 characters)"});
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
>>>>>>> 461b493 (Admin dashboard changes)
        const newUser = new userModel({
            name,
            email,
            password:hashedPassword
<<<<<<< HEAD
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true, token})
    }
    catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//route for admin login
const adminLogin = async (req,res) => {
    // res.json({msg:"Admin Login Api Working"})
    try {
        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD)
        {
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:"true",token})
        }
        else
        {
            res.json({success:"false",message:"Invalid Admin Credentials"})
        }
    } 
    catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})        
    }
}

export {loginUser, registerUser, adminLogin}
=======
        });
        const user = await newUser.save();
        const token = createToken(user._id); //token
        res.json({success:true,token});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

//Route for admin login------------------------------------------------
const adminLogin = async (req,res)=>{
    try{
        const {email,password} = req.body;
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success:true,token});
        } else{
            res.json({success:false,message:"Invaild credentials"});
        }
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

export { loginUser, registerUser, adminLogin };
>>>>>>> 461b493 (Admin dashboard changes)
