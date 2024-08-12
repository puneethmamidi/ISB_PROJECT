import mongoose from "mongoose";

const PracticeSchema= new mongoose.Schema({
    word:{
        type:String,
    },
    user_answer:{
        type:String,
    },
    score:{
        type: Number,
        float: true
    },
    player_id:{
        type:String
    },
    player_username:{
        type:String,
    }
},{timestamps:true})


const PracticeModel= mongoose.model('practiceScores',PracticeSchema)


export default PracticeModel

