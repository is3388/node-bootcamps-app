const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')
const resetPasswordEmail = require('../utils/sendEmail')
const crypto = require('crypto')

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

// @desc Update login user details only name and email not role
// @route PUT /api/v1/auth/updatedetails
// @access Private
exports.updateDetails = asyncHandler(async (req, res, next) =>
{
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, 
        {
            new: true,
            runValidators: true
        })
    // no need to write if (!user) as middleware protect run before this function
    res.status(200).json({ success: true, data: user })

})

// @desc Update login user password
// @route PUT /api/v1/auth/updatepassword
// @access Private
exports.updatePassword = asyncHandler(async (req, res, next) =>
{   // use login user id to find the user in database
    const user = await User.findById(req.user.id).select('+password')
    // check current password if it matches in database
    if(!( await user.matchPassword(req.body.currentPassword)))
    {
        return next(new ErrorResponse('Invalid password', 401))
    }
    // save new password in database
    user.password = req.body.newPassword
    user.save()

    sendTokenResponse(user, 200, res)
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
     // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
     await resetPasswordEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    })

    res.status(200).json({ success: true, data: 'Email sent' })
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
})

// @desc Reset password
// @route PUT /api/v1/auth/resetpassword/:resettoken
// @access Public // since the token from the email has expiration
exports.resetPassword = asyncHandler(async (req, res, next) =>
{   // get the token from req.params.resettoken and hash it to see if it matches with the database
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')
    // get the user from the database
    const user = await User.findOne({
        resetPasswordToken, 
        resetPasswordExpire: { $gt: Date.now()}
    })
    if (!user)
    {
        return next(new ErrorResponse('Invalid token', 400))
    }
    // set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    sendTokenResponse(user, 200, res)
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