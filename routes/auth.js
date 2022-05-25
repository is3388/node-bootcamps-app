const express = require('express')
const { signup, login, getProfile  } = require('../controllers/auth')
const { protect } = require('../middleware/auth')
const router = express.Router()

router.post('/register', signup)
router.post('/login', login)
router.get('/profile', protect, getProfile)




module.exports = router
