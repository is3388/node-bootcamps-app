const express = require('express')
const dotenv = require('dotenv')

// since this config file is not .env on the root, needs to specify path
dotenv.config({path: './config/config.env'})
const app = express()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => { console.log(`Server running in 
${process.env.NODE_ENV} mode on port ${PORT}`)
})

