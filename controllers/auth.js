const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')

// @desc Register user
// @route POST /api/v1/auth/register
// @access Public
exports.signup = asyncHandler(async (req, res, next) =>
 {
    const {name, email, password, role} = req.body
    // create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })
 const token = user.getSignedJwtToken()
 res.status(200).json({ success: true, token })
 })

// @desc Login user
// @route POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) =>
{
   const {email, password} = req.body
   // validate email and password
    if(!email || !password)
    {
        return next(new ErrorResponse('Please provide email and password', 400))
    }
    // check for user and include password on return
    const user = await User.findOne({email}).select('+password')
    if(!user)
    {
        return next(new ErrorResponse('Invalid credentials', 401))
    }
   // validate password
   const isMatch = await user.matchPassword(password)
   if (!isMatch)
   {
    return next(new ErrorResponse('Invalid credentials', 401))
   }
   // send token
    const token = user.getSignedJwtToken()
    res.status(200).json({ success: true, token })
})