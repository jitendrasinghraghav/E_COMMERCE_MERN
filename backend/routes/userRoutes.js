import express from 'express'
import { allUser, changePassword, forgotPassword, getUserById, login, logout, register, reVerify, verify, verifyOTP } from '../controllers/userControllers.js'
import { isAdmin, isAuthenticated } from '../middleware/isAuthentication.js'


const router = express.Router()

router.post('/register', register)
router.post('/verify', verify)
router.post('/reverify', reVerify)
router.post('/login', login)
router.post('/logout',isAuthenticated, logout)

export default router