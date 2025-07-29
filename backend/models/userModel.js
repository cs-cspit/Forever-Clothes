import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    cartData: {type:Object, default: {}, required:true}  //when use create account it get cart with 0 item using of default is {null}
},{minimize:false}) //mongoose naglet the empty object property so minimize property create cart data using empty object

const userModel = mongoose.models.user || mongoose.model('user',userSchema)

export default userModel