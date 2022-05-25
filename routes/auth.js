const express = require('express')
const { signup, login, getProfile, forgotPassword  } = require('../controllers/auth')
const { protect } = require('../middleware/auth')
const router = express.Router()

router.post('/register', signup)
router.post('/login', login)
router.get('/profile', protect, getProfile)
router.post('/forgotpassword', forgotPassword)





module.exports = router
