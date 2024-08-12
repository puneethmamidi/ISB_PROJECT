import express, { response } from 'express';
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRoutes from './routes/Auth.js';
import AdminRoutes from './routes/AdminRoutes.js';
const PORT=process.env.PORT || 5000
dotenv.config()
const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET","PUT","DELETE"],
  credentials: true
}));
app.use(cookieParser());

connectDB()

app.use('/api/auth',AuthRoutes)
app.use('/api/admin',AdminRoutes)

app.get('/',(req,res)=>{
    res.send('Express on routes')
})














app.listen(PORT,()=>{
  console.log(`server is running on ${PORT}`)
})
