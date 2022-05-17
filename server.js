const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const bootcamps = require('./routes/bootcamps')
//const logger = require('./middleware/logger')
const morgan = require('morgan')
const colors = require('colors')

// since this config file is not .env on the root, needs to specify path
dotenv.config({path: './config/config.env'})

// connect to DB
connectDB()

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

const server = app.listen(PORT, () => { console.log(`Server running in 
${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})

// custom handler to handle unhandled promise rejection if no try/catch block in db.js
// close the server and stop the application
process.on('unhandledRejection', (err, promise) =>
{
    console.log(`Error: ${err.message}`.red)
    //close server and exit process
    server.close(() => process.exit(1))
})

