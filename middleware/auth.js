const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('./async') 
const User = require('../models/User')

// to verify token in order to protect routes from being access by user. It must be publisher role or admin role
exports.protect = asyncHandler( async( req, res, next ) =>
{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(' ')[1] // Bearer tokenValue
    }
    //else if (req.cookies.token)
    //{
        //token = req.cookies.token
    //}
    // make sure token exists
    if(!token)
    {
        return next( new ErrorResponse('Not authorize to access this route'), 401)
    }
    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
        req.user = await User.findById(decoded.id)
        next()
    }
    catch (err)
    {
        return next( new ErrorResponse('Not authorize to access this route'), 401)
    }
})



