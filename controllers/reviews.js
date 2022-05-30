const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')

// @desc Get all reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access Public
exports.getReviews = asyncHandler(async (req, res, next) =>
{
    if(req.params.bootcampId) // get reviews of a specific bootcamp
    {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId})
        res.status(200).json({success: true, count: reviews.length, data: reviews})
    }
    else
    { 
        res.status(200).json(res.advancedResults) // get all reviews and can be used with pagination etc
    }
    
})

// @desc Get specific review
// @route GET /api/v1/reviews/:id
// @access Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if(!review)
    {   
        return next(new ErrorResponse(`No review found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({success: true, data: review })
})

// @desc Add new review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access Private must be login user
    exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    
    if(!bootcamp)
    {   
        return next(new ErrorResponse(`No bootcamp is found with id of ${req.params.bootcampId}`, 404))
    }

    const review = await Review.create(req.body)
    res.status(201).json({success: true, data: review})
})

// @desc updaate a review
// @route PUT /api/v1/reviews/:id
// @access Private must be login user
exports.updateReview = asyncHandler(async (req, res, next) => {
    
    let review = await Review.findById(req.params.id)
    
    if(!review)
    {   
        return next(new ErrorResponse(`No review found with id of ${req.params.id}`, 404))
    }

    // check if user is review belongs to the user or admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin')
    {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this review`, 401))
    }

   review = await Review.findByIdAndUpdate(req.params.id, req.body, 
    { new:  true, // new version
      runValidators: true // run validation
    })
    review.save()
    res.status(200).json({success: true, data: review})
})

// @desc delete a review
// @route DELETE /api/v1/reviews/:id
// @access Private must be login user
exports.deleteReview = asyncHandler(async (req, res, next) => {
    
    const review = await Review.findById(req.params.id)
    
    if(!review)
    {   
        return next(new ErrorResponse(`No review found with id of ${req.params.id}`, 404))
    }

    // check if user is the review belongs to the user or admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin')
    {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this review`, 401))
    }
   await review.remove()
    res.status(200).json({success: true, data: {}})
})

