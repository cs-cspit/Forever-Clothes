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
        const newUser = new userModel({
            name,
            email,
            password:hashedPassword
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