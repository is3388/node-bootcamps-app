const NodeGeocoder = require('node-geocoder')
//const dotenv = require('dotenv')
//dotenv.config({ path: "./config/config.env" })// no need to write as in server.js

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}

const geocoder = NodeGeocoder(options)

module.exports = geocoder