const express = require('express')
const dotenv = require('dotenv')
const bootcamps = require('./routes/bootcamps')

// since this config file is not .env on the root, needs to specify path
dotenv.config({path: './config/config.env'})
const app = express()
// mount routers
app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => { console.log(`Server running in 
${process.env.NODE_ENV} mode on port ${PORT}`)
})

