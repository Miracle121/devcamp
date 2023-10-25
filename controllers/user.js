const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')


// @desc get all Users
// @route  GET /api/v1/user
// @access Private/Admin

exports.getUsers = asyncHandler(async (req, res, next) => {  
    res.status(200).json(res.advancedResults)

})

//@desc get  User by id
//@route  GET /api/v1/user/:Id
//@access Private/Admin

exports.getUsersById = asyncHandler(async (req, res, next) => {
    const usersId = req.params.id
    const users = await User.findById(usersId)
    if (users) {
        res.status(200)
            .json({
                success: true,
                data: users,
                msg: `Show a Users ${req.params.id}`
            })

    } else {
        res.status(404)
            .json({
                success: false,
                msg: `User not found ${req.params.id}`
            })
    }



})

//@desc POST  Create New User 
//@route  POST /api/v1/user
//@access Private/Admin

exports.createUsers = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)   
    res.status(201).json({
        success: true,
        msg: `Create new users`,
        data: user
    })
})

//@desc PUT  Update User 
//@route  PUT /api/v1/user/:Id
//@access Private/Admin

exports.updateUsers = async (req, res, next) => {
    try {
        const user_id = req.params.id
        const users = await User.findByIdAndUpdate(user_id, { $set: req.body }, {
            new: true,
            runValidators: true
        })
        if (!users) {
            res.status(404)
                .json({
                    success: false,
                    msg: `User not found ${user_id}`
                })
        }
        res.status(200)
            .json({
                success: true,
                data: users,
                msg: `Updated user ${req.params.id}`
            })
    } catch (err) {
        next(err)
    }

}

//@desc DELETED  Users 
//@route  DELETED /api/v1/user/:Id
//@access Public

exports.deletedUsers = async (req, res, next) => {
    try {
        const user_id = req.params.id
        const users = await User.findByIdAndDelete(user_id)
        res.status(200)
            .json({
                success: true,
                data: users,
                msg: `Deleted user ${req.params.id}`
            })

    } catch (err) {
        res.status(400)
            .json({
                success: false,
                msg: 'Bad Request'
            })
    }

}