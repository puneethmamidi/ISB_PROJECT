import express from 'express'
import { CheckUser, Login, Logout, register,forgot,reset_password,getAverageScore,wordFetch,practiceScores} from '../controllers/Auth.js'
import {IsUser} from '../middleware/verifyToken.js'
const AuthRoutes=express.Router()

AuthRoutes.post('/register',register)
AuthRoutes.post('/login',Login)
AuthRoutes.post('/logout',Logout)
AuthRoutes.post('/forgot',forgot)
AuthRoutes.post('/reset_password/:id/:token',reset_password)
AuthRoutes.post('/practiceScores',practiceScores)
AuthRoutes.get('/wordFetch/:n',wordFetch)
AuthRoutes.get('/CheckUser',IsUser,CheckUser)
AuthRoutes.get('/average-score/:id',getAverageScore)

export default AuthRoutes