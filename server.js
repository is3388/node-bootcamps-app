const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

//const logger = require('./middleware/logger')
const errorHandler = require('./middleware/error')
const morgan = require('morgan')
const colors = require('colors')

// since this config file is not .env on the root, needs to specify path
dotenv.config({path: './config/config.env'})

// connect to DB
connectDB()

// load route files
const bootcamps = require('./routes/bootcamps')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'))
}
// mount logger must write first before any route
//app.use(logger)

// mount routers
app.use('/api/v1/bootcamps', bootcamps)
// mount logger

// mount express custom handlers
app.use(errorHandler)

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

