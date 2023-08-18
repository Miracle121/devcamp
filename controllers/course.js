const Course = require('../models/course')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc get all Courses
// @route  GET /api/v1/cours
// @route  GET /api/v1/cours/:bootcampId
// @access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampiId) {
        query = Course.find({ bootcamp: req.params.bootcampiId })
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: ' name , description'
        })
    }
    const cours = await query
    res.status(200).json({
        success: true,
        count: cours.length,
        data: cours,
        msg: 'Show all cours'
    })
})

//@desc get  Courses by id
//@route  GET /api/v1/cours/:Id
//@access Public

exports.getCoursById = asyncHandler(async (req, res, next) => {
    const cours_id = req.params.id
    const courses = await Course.findById(cours_id)
    if (courses) {
        res.status(200)
            .json({
                success: true,
                data: courses,
                msg: `Show a courses ${req.params.id}`
            })

    } else {
        res.status(404)
            .json({
                success: false,
                msg: `Course not found ${req.params.id}`
            })
    }



})

//@desc POST  Create Courses 
//@route  POST /api/v1/cours
//@access Public

exports.createCours = asyncHandler(async (req, res, next) => {

    const title = req.body.title
    const description = req.body.description
    const weeks = req.body.weeks
    const tuition = req.body.tuition
    const minimumSkill = req.body.minimumSkill
    const scholarshipAvailable = req.body.scholarshipAvailable
    const bootcampId = req.body.bootcamp

    const courses = new Course({
        title: title,
        description: description,
        weeks: weeks,
        tuition: tuition,
        minimumSkill: minimumSkill,
        scholarshipAvailable: scholarshipAvailable,
        bootcamp: bootcampId
    })
    const data = await courses.save()

    res.status(201).json({
        success: true,
        msg: `Create new course`,
        data: data
    })
})

//@desc PUT  Update Courses 
//@route  PUT /api/v1/cours/:Id
//@access Public

exports.updateCours = async (req, res, next) => {
    try {
        const course_id = req.params.id
        const courses = await Course.findByIdAndUpdate(course_id, { $set: req.body }, {
            new: true,
            runValidators: true
        })
        if (!courses) {
            res.status(404)
                .json({
                    success: false,
                    msg: `Bootcamp not found ${course_id}`
                })
        }
        res.status(200)
            .json({
                success: true,
                data: courses,
                msg: `Updated bootcamp ${req.params.id}`
            })
    } catch (err) {
        next(err)
        // res.status(400)
        //     .json({
        //         success: false,
        //         err: err,
        //         msg: 'Bad Request'
        //     })

    }

}

//@desc DELETED  Update Courses 
//@route  DELETED /api/v1/cours/:Id
//@access Public

exports.deletedCours = async (req, res, next) => {
    try {
        const courses_id = req.params.id
        const courses = await Course.findByIdAndDelete(courses_id)
        res.status(200)
            .json({
                success: true,
                data: courses,
                msg: `Deleted courses ${req.params.id}`
            })

    } catch (err) {
        res.status(400)
            .json({
                success: false,
                msg: 'Bad Request'
            })
    }

}