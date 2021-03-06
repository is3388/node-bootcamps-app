const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const path = require('path')

//const logger = require('./middleware/logger')
const errorHandler = require('./middleware/error')
const morgan = require('morgan')
const colors = require('colors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

// since this config file is not .env on the root, needs to specify path
dotenv.config({path: './config/config.env'})

// connect to DB
connectDB()

// load route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const users = require('./routes/users')
const reviews = require('./routes/reviews')
const auth = require('./routes/auth')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'))
}
// mount logger must write first before any route
//app.use(logger)

// mount file upload
app.use(fileUpload())

// mount express mongo santize to sanitize data input such as email, password
// {"email": {"$gt":""},"password": "123456"} in Postman, you will get 404
app.use(mongoSanitize())

// set security headers
app.use(helmet())

// prevent cross site scripting XSS attack
app.use(xss())

// rate limiting each IP to make certain request in certain period of time
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, // 10 mins
                            max: 100 // 100 requests per 10 mins for each IP address
                        })
app.use(limiter)

// prevent http param pollution
app.use(hpp())

// enable CORS cross origin resource to let other domain such as frontend domain can connect to our public API
app.use(cors())

// set up serve up static folder is public directory
app.use(express.static(path.join(__dirname, 'public')))

// mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)
app.use('/api/v1/auth', auth)


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

