const express = require('express')
const { signup, login, logout, getProfile, forgotPassword, resetPassword, updateDetails, updatePassword  } = require('../controllers/auth')
const { protect } = require('../middleware/auth')
const router = express.Router()

router.post('/register', signup)
router.post('/login', login)
router.get('/logout', logout)
router.get('/profile', protect, getProfile)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)





module.exports = router
