const express = require('express')
const { signup } = require('../controllers/auth')

const router = express.Router()

router.post('/register', signup)




module.exports = router
