const colors = require('colors')

// custom Express error handler that route use next(err) passes to if there is any error
const errorHandler = (err, req, res, next) =>
{
    // log to console for developer
    console.log(err.stack.red)
    res.status(500).json({success: false, error: err.message})
}

module.exports = errorHandler