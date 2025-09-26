<<<<<<< HEAD
import mongoose from 'mongoose'

const connectDB = async () => {
    mongoose.connection.on('connected',()=>{
        console.log("Database Is Connected With Server");
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`)
}

export default connectDB;
=======
import mongoose from "mongoose";

const connectDB = async () => { 
  try {
    const connect = await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`);
    console.log(`MongoDB connected`);
  } 
  catch(error) {
    console.error(`ERROR in MongoDB connection : ${error.message}`);
  } 
};

export default connectDB;  
>>>>>>> 461b493 (Admin dashboard changes)
