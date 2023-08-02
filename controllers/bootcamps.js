const Bootcamps = require('../models/bootcamps')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc get all Bootcamps
// @route  GET /api/v1/bootcamps
// @access Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    try {
        const bootcamp = await Bootcamps.find()
        res.status(200)
            .json({
                success: true,
                data: bootcamp,
                msg: 'Show all bootcamps'
            })

    } catch (err) {
        res.status(400)
            .json({
                success: false,
                msg: 'Bad Request'
            })
    }
})

//@desc get  Bootcamp by id
//@route  GET /api/v1/bootcamps/:Id
//@access Public

exports.getBootcampsById = asyncHandler(async (req, res, next) => {
   
        const bootcamp_id = req.params.id
        const bootcamp = await Bootcamps.findById(bootcamp_id)
        if (bootcamp) {
            res.status(200)
                .json({
                    success: true,
                    data: bootcamp,
                    msg: `Show a bootcamp ${req.params.id}`
                })

        } else {
            res.status(404)
                .json({
                    success: false,
                    msg: `Bootcamp not found ${req.params.id}`
                })
        }
   
    

})

//@desc POST  Create Bootcamp 
//@route  POST /api/v1/bootcamps
//@access Public

exports.createBootcamps = asyncHandler(async (req, res, next) => {
   
        const name = req.body.name
        const description = req.body.description
        const website = req.body.website
        const phone = req.body.phone
        const email = req.body.email
        const address = req.body.address
        const careers = req.body.careers
        const housing = req.body.housing
        const jobAssistance = req.body.jobAssistance
        const jobGuarantee = req.body.jobGuarantee
        const acceptGi = req.body.acceptGi
        const bootcamp = new Bootcamps({
            name: name,
            description: description,
            website: website,
            photo: phone,
            email: email,
            address: address,
            careers: careers,
            housing: housing,
            jobAssistance: jobAssistance,
            jobGuarantee: jobGuarantee,
            acceptGi: acceptGi
        })
        const data = await bootcamp.save()

        res.status(201)
            .json({
                success: true,
                msg: `Create new bootcamp`,
                data: data
            })

  
        // res.status(400)
        //     .json({
        //         success: false,
        //         msg: 'Bad Request'
        //     })

   


})

//@desc PUT  Update Bootcamp 
//@route  PUT /api/v1/bootcamps/:Id
//@access Public

exports.updateBootcamps = async (req, res, next) => {



    try {
        const bootcamp_id = req.params.id
        const bootcamp = await Bootcamps.findByIdAndUpdate(req.params.id, { $set: req.body }, {
            new: true,
            runValidators: true
        })


        if (!bootcamp) {
            res.status(404)
                .json({
                    success: false,
                    msg: `Bootcamp not found ${req.params.id}`
                })
        }
        res.status(200)
            .json({
                success: true,
                data: bootcamp,
                msg: `Updated bootcamp ${req.params.id}`
            })
        // const name = req.body.name
        // const description = req.body.description
        // const website = req.body.website
        // const phone = req.body.phone
        // const email = req.body.email
        // const address = req.body.address
        // const careers = req.body.careers
        // const housing = req.body.housing
        // const jobAssistance = req.body.jobAssistance
        // const jobGuarantee = req.body.jobGuarantee
        // const acceptGi = req.body.acceptGi

        // bootcamp.name = name
        // bootcamp.description = description
        // bootcamp.website = website
        // bootcamp.phone = phone
        // bootcamp.email = email
        // bootcamp.address = address
        // bootcamp.careers = careers
        // bootcamp.housing = housing
        // bootcamp.jobAssistance = jobAssistance
        // bootcamp.jobGuarantee = jobGuarantee
        // bootcamp.acceptGi = acceptGi
        // const data = await bootcamp.save()


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

//@desc DELETED  Update Bootcamp 
//@route  DELETED /api/v1/bootcamps/:Id
//@access Public

exports.deletedBootcamps = async (req, res, next) => {
    try {
        const bootcamp_id = req.params.id
        const bootcamp = await Bootcamps.findByIdAndDelete(bootcamp_id)
        res.status(200)
            .json({
                success: true,
                data: bootcamp,
                msg: `Deleted bootcamp ${req.params.id}`
            })

    } catch (err) {
        res.status(400)
            .json({
                success: false,
                msg: 'Bad Request'
            })
    }

}