import mongoose from "mongoose";

const wordsSchema= new mongoose.Schema({
    Words:{
        type:String,
    }
},{timestamps:true})


const WordsModel= mongoose.model('Words',wordsSchema)


export default WordsModel

