const express = require('express')
const dotenv = require('dotenv')
const bootcamps = require('./routes/bootcamps')
//const logger = require('./middleware/logger')
const morgan = require('morgan')

// since this config file is not .env on the root, needs to specify path
dotenv.config({path: './config/config.env'})
const app = express()

if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'))
}
// mount logger must write first before any route
//app.use(logger)
// mount routers
app.use('/api/v1/bootcamps', bootcamps)
// mount logger

const PORT = process.env.PORT || 5000

app.listen(PORT, () => { console.log(`Server running in 
${process.env.NODE_ENV} mode on port ${PORT}`)
})

