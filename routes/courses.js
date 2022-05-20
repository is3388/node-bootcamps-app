const express = require('express')
const { getCourses, getCourse, addCourse } = require('../controllers/courses')

// in order to merge the URL param from other routes, add mergeParams to true
// so that merge '/:bootcampId/courses' with '/'
// in Postman {{URL}}/api/v1/bootcamps/5d713995b721c3bb38c1f5d0/courses
const router = express.Router({mergeParams: true})

router.route('/').get(getCourses).post(addCourse)
router.route('/:id').get(getCourse)

module.exports = router