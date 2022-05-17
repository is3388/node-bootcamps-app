const Bootcamp = require('../models/Bootcamp')

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = async (req, res, next) =>
{
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
    //res.status(400).json({success: false})
    try{
        const bootcamps = await Bootcamp.find({})
        res.status(200).json({success: true, data: bootcamps})
    }
    catch(err)
    {
        res.status(400).json({success: false})
    }
}

// @desc Create a new bootcamp
// @route POST /api/v1/bootcamps
// @access Private must be publisher or Admin
exports.createBootcamp = async (req, res, next) =>
{
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw 
    //res.send({name: 'Alex'}) // using res.send or res.json to send json object 
    //res.json({name:'Alex'})
    //res.sendStatus(400)
    //res.status(400).json({success: false})
    try{
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({success: true, data: bootcamp})
    }
    catch(err)
    {
        res.status(400).json({success:false})
    }
}

// @desc Get specific bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = async (req, res, next) => {
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
   //res.status(400).json({success: false})
   try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp)
        {   // prevent error of header already been sent since 2 res.status. add return
            return res.status(400).json({success: false})
        }
        res.status(200).json({success: true, data: bootcamp })
   }
   catch (err)
   {
       res.status(400).json({success: false})
   }
}

// @desc Update specific bootcamp
// @route PUT or PATCH /api/v1/bootcamps/:id
// @access Private must be publisher or Admin
exports.updateBootcamp = (req, res, next) => {
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
   //res.status(400).json({success: false})
   res.status(200).json({success: true, msg:`Update a bootcamp for ${req.params.id}`})
}

// @desc Delete specific bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private must be publisher or Admin
exports.deleteBootcamp = (req, res, next) => {
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
   //res.status(400).json({success: false})
   res.status(200).json({success: true, msg:`Delete a bootcamp for ${req.params.id}`})
}



