const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
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
        if(!bootcamps)
        {
            //return res.status(404).json({success: false})
            return next(new ErrorResponse(`Bootcamps not found`, 404))
        }
        res.status(200).json({success: true, count: bootcamps.length, data: bootcamps})
    }
    catch(err)
    {
        //res.status(400).json({success: false})
        next(err)
    }
}

// @desc Create a new bootcamp
// @route POST /api/v1/bootcamps
// @access Private must be publisher or Admin
exports.createBootcamp = async (req, res, next) =>
{
    try{
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({success: true, data: bootcamp})
    }
    catch(err)
    {
        //res.status(400).json({success:false})
        next(err)
    }
}

// @desc Get specific bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = async (req, res, next) => {
   try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp)
        {   // prevent error of header already been sent since 2 res.status. add return
            //return res.status(404).json({success: false})
            // invalid formated id
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({success: true, data: bootcamp })
   }
   catch (err)
   {
        //res.status(400).json({success: false})
        next(err) // incorrect formated id
        //next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
   }
}

// @desc Update specific bootcamp
// @route PUT or PATCH /api/v1/bootcamps/:id
// @access Private must be publisher or Admin
exports.updateBootcamp = async (req, res, next) => {
   try
   {
       const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, 
        { new: true, runValidators: true })
        if(!bootcamp)
        {
            //return res.status(404).json({success: false})
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({success: true, data: bootcamp})
    }
    catch(err)
    {
        //res.status(400).json({success: false})
        next(err)
    }
}

// @desc Delete specific bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private must be publisher or Admin
exports.deleteBootcamp = async (req, res, next) => {
   //await Bootcamp.findByIdAndDelete(req.params.id)
   try {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp)
    {
        //return res.status(400).json({success: false})
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    bootcamp.remove()
    res.status(200).json({success: true, data: {}})
   }
   catch(err)
   {
       //res.status(400).json({success:false})
       next(err)
   }
}



