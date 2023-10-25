const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamps')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc get all Courses
// @route  GET /api/v1/cours
// @route  GET /api/v1/cours/:bootcampId
// @access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
    // let query;

    if (req.params.bootcampiId) {
        const cours = await Course.find({ bootcamp: req.params.bootcampiId })
        res.status(200).json({
            success: true,
            count: cours.length,
            data: cours
        })

    } else {
        res.status(200).json(res.advancedResults)
    }

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

    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(
            new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`)
        )
    }

      //Make sure user is bootcamp owner
      if(bootcamp.user.toString() !== req.user.id && req.user.role !=='admin'){
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,401)
        )
    }

    const course = await Course.create(req.body)
    res.status(201).json({
        success: true,
        msg: `Create new course`,
        data: course
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