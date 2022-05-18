const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) =>
{
    //res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
    //res.status(400).json({success: false})
        const bootcamps = await Bootcamp.find({})
        if(!bootcamps)
        {
            //return res.status(404).json({success: false})
            return next(new ErrorResponse(`Bootcamps not found`, 404))
        }
        res.status(200).json({success: true, count: bootcamps.length, data: bootcamps})
   
})

// @desc Create a new bootcamp
// @route POST /api/v1/bootcamps
// @access Private must be publisher or Admin
exports.createBootcamp = asyncHandler(async (req, res, next) =>
{
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({success: true, data: bootcamp})
    
})

// @desc Get specific bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp)
        {   // prevent error of header already been sent since 2 res.status. add return
            //return res.status(404).json({success: false})
            // invalid formated id
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({success: true, data: bootcamp })
})

// @desc Update specific bootcamp
// @route PUT or PATCH /api/v1/bootcamps/:id
// @access Private must be publisher or Admin
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
       const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, 
        { new: true, runValidators: true })
        if(!bootcamp)
        {
            //return res.status(404).json({success: false})
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({success: true, data: bootcamp})
})

// @desc Delete specific bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private must be publisher or Admin
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
   //await Bootcamp.findByIdAndDelete(req.params.id)
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp)
    {
        //return res.status(400).json({success: false})
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    bootcamp.remove()
    res.status(200).json({success: true, data: {}})
})



