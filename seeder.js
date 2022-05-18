const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//load env vars
dotenv.config({path: './config/config.env'})

//load models
const Bootcamp = require('./models/Bootcamp')
//connect to DB
mongoose.connect(process.env.MONGODB_URL), {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

//read JSON file
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/data/bootcamps.json`, 'utf-8'))

//import data into DB
const importData = async() =>
{
    try
    {
        await Bootcamp.create(bootcamps)
        console.log('Data imported ...'.green.inverse)
        process.exit()
    }
    catch(err)
    {
        console.error(err)
    }
}

const deletetData = async() =>
{
    try
    {
        await Bootcamp.deleteMany()
        console.log('Data destroyed ...'.red.inverse)
        process.exit()
    }
    catch(err)
    {
        console.error(err)
    }
}

if(process.argv[2] === '-i')
{
    importData()
}
else if(process.argv[2] === '-d')
{
    deletetData()
}
