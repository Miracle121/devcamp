const express = require('express')
const course = require('../controllers/course')
const Courses = require('../models/Course')
const advancedResults = require('../middleware/advancedResult')
const {protect,authorize} = require('../middleware/auth')
const router = express.Router({mergeParams:true})

router.get('/', advancedResults(Courses,{
    path: 'bootcamp',
    select: ' name , description'
}),course.getCourses)
router.get('/:id',course.getCoursById )
router.post('/', protect,authorize('publisher','admin'),course.createCours)
router.put('/:id', protect,authorize('publisher','admin'),course.updateCours)
router.delete('/:id',protect,authorize('publisher','admin'),course.deletedCours)
module.exports = router