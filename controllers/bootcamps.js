const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const path = require('path')

// @desc Get all bootcamps with associated courses
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) =>
{
    /*the code moves to custom middleware called advancedResults//res.send('<h1>Hello from Express</h1>') // go to Postman Preview not raw to see
    //res.send({name: 'Alex'}) // using res.send to send json object
    //res.json({name:'Alex'})
    //res.sendStatus(400)
    //res.status(400).json({success: false})   
    // filtering with query string, use let because it changes depending on input
    let query
    // make a copy of an object of query string so that it won't affect the original one
    const reqQuery = { ...req.query }

    // create fields to exclude that don't want to be matched for filtering
    const removeFields = ['select', 'sort', 'page', 'limit']

    // loop over removeFields and delete them from reqQuery is JS  way to delete key/value pair in object. like delete select=something from reqQuery
    removeFields.forEach(param => delete reqQuery[param])
    console.log(reqQuery) //return {} because key/value pair of removeFields has been removed from reqQuery

    // create query string
    let queryString = JSON.stringify(reqQuery) // object to string
    // create operators such as $gt, $gte

    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`) // dollar sign and whatever match within the regex will put $ sign in front of it.
    //console.log(queryString)

    // find resources
    //query = Bootcamp.find(JSON.parse(queryString)) // find({}) is an object
    // reverse populate with virtual object to get an array of all courses
    // limit certain fields to show, passing object with path and select to populate
    query = Bootcamp.find(JSON.parse(queryString)).populate('courses')
    // select fields req.query.select to check if the word select is there in query string
    // in Postman {{URL}}/api/v1/bootcamps/?select=name,description
    // but Mongoose query syntax is query.select('name description) no comma between fields
    if(req.query.select) // look at the original req.query not reqQuery which is the one delete Select = something. Output only shows specific field
    {
        const fields = req.query.select.split(',').join(' ') // extract two fields like name and description from select=name,description
        //Mongoose syntax query.select('name description)
        query = query.select(fields)
    }

    // sort by fields
    if(req.query.sort)
    {
        const sortBy = req.query.sort.replace(',', ' ')
        query = query.sort(sortBy)
    }
    else
    {
        // default sort by date desc
        // query = query.sort('-createdAt') 
        // sort by date first and then name in desc if 2 dates the same
        query = query.sort({ "createdAt": 'asc', name: -1 })
    }

    // pagination ?limit=2
    const page = parseInt(req.query.page, 10) || 1 // 10 base, 1 is default value for the requested page
    const limit = parseInt(req.query.limit, 10) || 10 // page size which is number of items on a page
    const startIndex = (page - 1) * limit 
    const endIndex = page * limit
    const total = Bootcamp.find(JSON.parse(queryString)).countDocuments()

    query = query.skip(startIndex).limit(limit)
        
    // execute query
    const bootcamps = await query
    // show next or previous if available
    const pagination = {}
    if (endIndex < total)
    {
        pagination.next = { page: page + 1,
                            limit 
                        }
    }
    if (startIndex > 0)
    {
        pagination.prev = { page: page - 1,
                            limit 
                        }
    }*/

        res.status(200).json(res.advancedResults)
   
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
   //await Bootcamp.findByIdAndDelete(req.params.id) won't trigger pre middleware
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp)
    {
        //return res.status(400).json({success: false})
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    bootcamp.remove()
    res.status(200).json({success: true, data: {}})
})

// @desc Get bootcamps within distance (radius in miles)
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) =>
{
        const {zipcode, distance} = req.params
        const loc = await geocoder.geocode(zipcode)
        const lat = loc[0].latitude
        const lng = loc[0].longitude

        // calculate radius using radians by dividing distance of radius of earth
        // earth radius = 3,963 mi/6,378 km
        const radius = distance/3963
        const bootcamps = await Bootcamp.find({location: {
            $geoWithin: { $centerSphere: [ [lng, lat], radius]}
        }})
        
        res.status(200).json({success: true, count: bootcamps.length, data: bootcamps})
   
})

// @desc Upload photo for a specific bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private must be publisher or Admin
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
     if(!bootcamp)
     {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
     }
     if(!req.files)
     {
        return next(new ErrorResponse('Please upload a file', 400))
     }
     //console.log(req.files.file) // get buffer data and filename
     const file = req.files.file

     if(!file.mimetype.startsWith('image'))
     {
        return next(new ErrorResponse('Please upload an image file', 400)) 
     }
     
     if(file.size > process.env.MAX_FILE_UPLOAD)
     {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD} `, 400)) 
     }

     // create a custom filename and use parse to get the orginial file extension
     file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
     //console.log(file.name)
     // move to destination directory
     file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>
     {
         if (err)
         {
             console.error(err)
             return next(new ErrorResponse('Problem with file upload', 500)) 
         }
        // insert file into database
        //const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name})
        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name})
        //res.status(200).json({success: true, data: bootcamp})
        res.status(200).json({success: true, data: file.name})
    })
})



