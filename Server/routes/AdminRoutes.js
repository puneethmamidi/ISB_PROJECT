import express from 'express';
import { getUsers,insertWords,getWords,addWord,updateWords,deleteWords,deleteAllWords} from '../controllers/Admin.js';
//import { isAdmin } from '../middleware/verifyToken.js'
import multer from 'multer';
const upload = multer({ dest: './uploads/', limits: { fileSize: 1000000 }, fileFilter(req, file, cb) {
  if (!file.originalname.match(/\.(csv|CSV)$/)) {
    return cb(new Error('Only CSV files are allowed!'));
  }
  cb(undefined, true);
} });

const AdminRoutes=express.Router()

AdminRoutes.get('/getUsers',getUsers)
AdminRoutes.post('/insertWords',upload.single('file'),insertWords)
AdminRoutes.get('/getWords',getWords)
AdminRoutes.post('/addWord',addWord)
AdminRoutes.put('/updateWords',updateWords)
AdminRoutes.delete('/deleteWords',deleteWords)
AdminRoutes.delete('/deleteAllWords',deleteAllWords)



export default AdminRoutes