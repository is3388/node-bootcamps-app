const colors = require('colors')
const ErrorResponse = require('../utils/errorResponse')

// custom Express error handler that route use next(err) passes to if there is any error
const errorHandler = (err, req, res, next) =>
{
    // log to console for developer
    //console.log(err.stack.red)
    let error = {...err}
    error.message = err.message
    console.log(err)

    // Mongoose bad ObjectID with invalid format
    if(err.name === 'CastError')
    {
        //const message = `Resource not found with id of ${err.value}`
        const message = 'Resource not found'
        error = new ErrorResponse(message, 404)
    }
    // Mongoose duplicate key
    if(err.code === 11000)
    { 
        const message = 'Duplicate field value'
        error = new ErrorResponse(message, 400)
    }

    // Mongoose validation error instead of using Express Validator
    if(err.name === 'ValidationError')
    { 
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server Error'})
}

module.exports = errorHandler