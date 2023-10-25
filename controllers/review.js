const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamps')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc get all Review
// @route  GET /api/v1/review
// @route  GET /api/v1/bootcamps/:bootcampId/reviews
// @access Public

exports.getReview = asyncHandler(async (req, res, next) => {
    if (req.params.id) {
        const reviws = await Review.find({ bootcamp: req.params.id })
        res.status(200).json({
            success: true,
            count: reviws.length,
            data: reviws
        })
    } else {
        res.status(200).json(res.advancedResults)
    }

})

//@desc get  Review by id
//@route  GET /api/v1/review/:Id
//@access Public

exports.getReviewById = asyncHandler(async (req, res, next) => {
    const review_id = req.params.id
    const reviews = await Review.findById(review_id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if (reviews) {
        res.status(200)
            .json({
                success: true,
                data: reviews,
                msg: `Show a reviews ${req.params.id}`
            })

    } else {
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404))
        // res.status(404)
        //     .json({
        //         success: false,
        //         msg: `Reviews not found ${req.params.id}`
        //     })
    }
})

//@desc POST  Create Review 
//@route  POST /api/v1/bootcamps/:id/review
//@access Public
exports.createReview = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.id
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.id)
    // .populate({
    //     path:'bootcamp',
    //     select:'name description'
    // })

    if (!bootcamp) {
        return next(
            new ErrorResponse(`No bootcamp with the id of ${req.params.id}`)
        )
    }

   

    const course = await Review.create(req.body)
    res.status(201).json({
        success: true,
        msg: `Create new Review`,
        data: course
    })





})

//@desc PUT  Update Review 
//@route  PUT /api/v1/review/:Id
//@access Public

exports.updateReview = async (req, res, next) => {
    try {
        const review_id = req.params.id
        const  reviews = await Review.findById(review_id)
        
        if (!reviews) {
            new ErrorResponse(`No reviews with the id of ${req.params.id}`, 404)           
        }
        //Make sure review belongs to user or user is admin
        if(reviews.user.toString()!== req.user.id && req.user.role!=='admin'){
            new ErrorResponse(`Not authorized to update review `, 401) 

        }
        const review = await Review.findByIdAndUpdate(review_id, { $set: req.body }, {
            new: true,
            runValidators: true
        })
        res.status(200)
            .json({
                success: true,
                data: review,
                msg: `Updated reviews ${req.params.id}`
            })
    } catch (err) {
        next(err)
    }

}

//@desc DELETED   Review 
//@route  DELETED /api/v1/review/:Id
//@access Public

exports.deletedReview = async (req, res, next) => {    
        const review_id = req.params.id
        let reviews = await Review.findById(review_id)
        if(!reviews){
            new ErrorResponse(`Review not found `, 404) 
        }
        //Make sure review belongs to user or user is admin
        if(reviews.user.toString()!== req.user.id && req.user.role!=='admin'){
            new ErrorResponse(`Not authorized to update review `, 401) 

        }

        reviews = await Review.findByIdAndDelete(review_id)
        res.status(200)
            .json({
                success: true,
                data: reviews,
                msg: `Deleted reviews ${req.params.id}`
            })
}