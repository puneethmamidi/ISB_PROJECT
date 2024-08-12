import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    age:{
        type:Number,
        required:true,
        
    },
    gender:{
        type:String,
        required:true,
        
    },
    role:{
        type:String,
        enum:['admin',"user"],
        default:"user"
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})


const UserModel= mongoose.model('users',userSchema)


export default UserModel

