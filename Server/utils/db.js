import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('MongoDb is connected')
     } catch (error) {
         console.log(error)
     }
 
}


export default connectDB;