const express = require('express')
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses')
const Course = require('../models/Course')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

// in order to merge the URL param from other routes, add mergeParams to true
// so that merge '/:bootcampId/courses' with '/'
// in Postman {{URL}}/api/v1/bootcamps/5d713995b721c3bb38c1f5d0/courses
const router = express.Router({mergeParams: true})

router.route('/').get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}), getCourses)
.post(protect, authorize('publisher', 'admin'), addCourse)
router.route('/:id').get(getCourse).put(protect, authorize('publisher', 'admin'), updateCourse).delete(protect, authorize('publisher', 'admin'), deleteCourse)

module.exports = router