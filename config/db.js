const mongoose = require('mongoose')
const colors = require('colors')
const connectDB = async () =>
{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL,  {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold)
    }
    catch(error)
    {
        console.error(`Error: ${error.message}`)
        process.exit(1)
        // or use return to stop the execution return console.error(`Error: ${error.message}`.red.underline.bold)
    }
}

module.exports =  connectDB
