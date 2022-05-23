const express = require('express')
const { getBootcamps, createBootcamp, getBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload } = require('../controllers/bootcamps')

// include other resource routers like course
const courseRouter = require('./courses')

const router = express.Router()

// re-route into other resource routers
// if that route get hit, pass onto that router
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/').get(getBootcamps).post(createBootcamp) 
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp) 
router.route('/:id/photo').put(bootcampPhotoUpload)
module.exports = router