import UserModel from '../models/users.js'
import WordsModel from '../models/word.js';
import PracticeModel from '../models/practiceScores.js';
import jwt, { decode } from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import nodemailer from 'nodemailer';
import { score_data } from '../middleware/score.js';
const { hashSync } = bcryptjs;
const register=async(req,res)=>{
    try {
        const {username,email,age,gender,password}=req.body
           
        const existUser= await UserModel.findOne({email})
        if (existUser) {
            return res.status(401).json({success:false,message:"User already Exist"})
        }
            const hash=await bcryptjs.hashSync(password,10)
        const newUser= new UserModel({
            username,email,age,gender,password:hash
        })
        
          await newUser.save()

          res.status(200).json({message:"user register successfully",newUser})
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error"})
        console.log(error)
    }
}

const Login=async(req,res)=>{
    try {
          const {email,password}=req.body

          const user=await UserModel.findOne({email})

          if (!user) {
              return res.status(404).json({success:false,message:"Invalid credentials"})
          }

          const passwordValid= await bcryptjs.compare(password,user.password)
          if (!passwordValid) {
            return res.status(404).json({success:false,message:"Invalid credentials"})
            
          }
               const token= jwt.sign({userId:user._id},process.env.JWT_SECRETE)

                res.cookie('token',token,{
                    httpOnly: true,
                    secure: false,
                    maxAge: 3600000,
                    
                })
              res.status(200).json({success:true,message:"Login successfully",user,token})

    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error"})
        console.log(error)
    }
}

const Logout=async(req,res)=>{
    try {
        res.clearCookie('token')
        res.status(200).json({message:"User Logout successfully"})
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error"})
        console.log(error)
    }
  }

const CheckUser=async(req,res)=>{
        try {
          const user=req.user
          if (!user) {
              res.status(404).json({message:'User not found'})
          }
          res.status(200).json(user)

          
      } catch (error) {
          res.status(500).json({message:"Internal server error"})
          console.log(error)
          
      }
}

const forgot = async (req, res) => {
      try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        const token= jwt.sign({userId:user._id},process.env.JWT_SECRETE)
        const transporter = nodemailer.createTransport({
          service:'gmail',
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: email, 
          subject: 'Password Reset',
          text: `http://localhost:3000/reset_password/${user._id}/${token}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Email sent successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
      }      
};
    
const reset_password = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    jwt.verify(token, process.env.JWT_SECRETE, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        const hash = bcryptjs.hashSync(password, 10);
        UserModel.findByIdAndUpdate(id, { password: hash }, { new: true })
          .then(() => {
            res.json({ message: 'Password reset successfully' });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error updating user password' });
          });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
        
};


const wordFetch = async (req, res) => {
    const n = req.params.n ;
    try {
      const words = await WordsModel.find({}).limit(n).exec();
      res.json({ message: `Words retrieved successfully (${n} records)`, words });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving words' });
    }
};


const practiceScores = async (req, res) => {
  try {
    const { values, word, player_id, player_username, user_answer } = req.body;
    const stringValue = JSON.parse(JSON.stringify(values)).user_data;
    const score = score_data(stringValue);
    if(score === null){
      res.json({ message: 'Invalid input data. Please enter valid English text.' });
    }else {
      await PracticeModel.insertMany({
        word,
        player_id,
        player_username,
        user_answer,
        score
      });
      res.json(score);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing request' });
  }
};
const getAverageScore = async (req, res) => {
  try {
    const player_id  = req.params;
    console.log(player_id);
    const playerIdValue = JSON.parse(JSON.stringify(player_id)).id;
    console.log(playerIdValue)
    const averageScore = await PracticeModel.aggregate([
      {
        $match: { player_id: playerIdValue }
      },
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$score" }
        }
      }
    ]);

    if (averageScore.length === 0) {
      res.json({ message: 'No scores found for this player' });
    } else {
      res.json({ averageScore: averageScore[0].averageScore });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing request' });
  }
};
export {register,Login,Logout,CheckUser,forgot,reset_password,wordFetch,practiceScores,getAverageScore}