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
 //const token = user.getSignedJwtToken()
 //res.status(200).json({ success: true, token })
 sendTokenResponse(user, 200, res)
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
    sendTokenResponse(user, 200, res)
})

// @desc Get current login user
// @route GET /api/v1/auth/profile
// @access Private
exports.getProfile = asyncHandler(async (req, res, next) =>
{
    const user = await User.findById(req.user.id)
    // no need to write if (!user) as middleware protect run before this function
    res.status(200).json({ success: true, data: user })

})

// @desc Forgot password
// @route POST /api/v1/auth/forgotpassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) =>
{
    const user = await User.findOne({email: req.body.email})
    if (!user) 
    {
        return next(new ErrorResponse(`There is no email with ${req.body.email}`, 404))
    }
    //get reset token
    const resetToken = user.getResetPasswordToken()
    // save the hash password token to database
    await user.save({validateBeforeSave: false})

    res.status(200).json({ success: true, data: user })

})

// custom function to get token from user,model and create a cookie 
// with token on it and send response
const sendTokenResponse = (user, statusCode, res) =>{
    const token = user.getSignedJwtToken()
    // expires in 30 days from whatever today is
    const options = { 
        expires: new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true // only send from client
    } 
    if (process.env.NODE_ENV === 'production')
    {
        options.secure = true
    }
    // set a cookie with token on it
    res.status(statusCode).cookie('token', token, options).json({success: true,
    token})
}