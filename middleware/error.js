const colors = require('colors')
const ErrorResponse = require('../utils/errorResponse')

// custom Express error handler that route use next(err) passes to if there is any error
const errorHandler = (err, req, res, next) =>
{
    // log to console for developer
    console.log(err.stack.red)
    let error = {...err}
    // Mongoose bad ObjectID
    if(err.name === 'CastError')
    {
        const message = `Resource not found with id of ${err.value}`
        error = new ErrorResponse(message, 404)
    }
    res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server Error'})
}

module.exports = errorHandler