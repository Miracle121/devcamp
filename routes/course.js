const express = require('express')
const course = require('../controllers/course')
const router = express.Router({mergeParams:true})

router.get('/', course.getCourses)
router.get('/:id',course.getCoursById )
router.post('/', course.createCours)
router.put('/:id', course.updateCours)
router.delete('/:id',course.deletedCours)
module.exports = router