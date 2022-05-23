const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses = asyncHandler(async (req, res, next) =>
{
    //let query
    if(req.params.bootcampId) // get courses of a specific bootcamp
    {
        //query = Course.find({ bootcamp: req.params.bootcampId})
        const courses = await Course.find({ bootcamp: req.params.bootcampId})
        res.status(200).json({success: true, count: courses.length, data: courses})
    }
    else
    { // to include info of associated bootcamp not only bootcamp id but all
      //  query = Course.find({}).populate('bootcamp')
      // to include info of associated bootcamp not only bootcamp id but some fields
        /*query = Course.find({}).populate({
            path: 'bootcamp',
            select: 'name description',
        })*/ // find all courses associated with all bootcamps
        res.status(200).json(res.advancedResults) // get all courses and can be used with pagination etc
    }
    
})

// @desc Get specific course
// @route GET /api/v1/courses/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id)
    if(!course)
    {   // prevent error of header already been sent since 2 res.status. add return
        //return res.status(404).json({success: false})
        // invalid formated id
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({success: true, data: course })
})

// @desc Add new course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access Private must be login user
    exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    
    if(!bootcamp)
    {   
        return next(new ErrorResponse(`No bootcamp is found with id of ${req.params.bootcampId}`, 404))
    }
    const course = await Course.create(req.body)
    res.status(200).json({success: true, data: course})
})

// @desc updaate a course
// @route PUT /api/v1/courses/:id
// @access Private must be login user
exports.updateCourse = asyncHandler(async (req, res, next) => {
    
    let course = await Course.findById(req.params.id)
    
    if(!course)
    {   
        return next(new ErrorResponse(`No course found with id of ${req.params.id}`, 404))
    }
   course = await Course.findByIdAndUpdate(req.params.id, req.body, 
    { new:  true, // new version
      runValidators: true // run validation
    })
    res.status(200).json({success: true, data: course})
})

// @desc delete a course
// @route DELETE /api/v1/courses/:id
// @access Private must be login user
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    
    const course = await Course.findById(req.params.id)
    
    if(!course)
    {   
        return next(new ErrorResponse(`No course found with id of ${req.params.id}`, 404))
    }
   await course.remove()
    res.status(200).json({success: true, data: {}})
})


