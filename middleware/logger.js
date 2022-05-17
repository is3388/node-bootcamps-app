// @desc logs request to console
const logger = (req, res, next) =>
{
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    next() // for all custom middleware must call next to move to next middleware in cycle
}   

module.exports = logger