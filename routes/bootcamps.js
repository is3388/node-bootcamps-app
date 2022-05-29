const express = require('express')
const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middleware/advancedResults')
const { getBootcamps, createBootcamp, getBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload } = require('../controllers/bootcamps')
const { protect, authorize } = require('../middleware/auth')

// include other resource routers like course
const courseRouter = require('./courses')
const reviewRouter = require('./reviews')

const router = express.Router()

// re-route into other resource routers
// if that route get hit, pass onto that router
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, authorize('publisher', 'admin'), createBootcamp) //courses is the virtual field (an array of courses) in Bootcamp model
router.route('/:id').get(getBootcamp).put(protect, authorize('publisher', 'admin'), updateBootcamp).delete(protect, authorize('publisher', 'admin'), deleteBootcamp) 
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)
module.exports = router