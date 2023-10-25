const path = require('path')
const Bootcamps = require('../models/Bootcamps')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc get all Bootcamps
// @route  GET /api/v1/bootcamps
// @access Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  
    res.status(200).json(res.advancedResults)
    // try {
    //     const bootcamp = await Bootcamps.find()
    //     res.status(200)
    //         .json({
    //             success: true,
    //             // pagenations,
    //             count: bootcamp.length,
    //             data: bootcamp,
    //             msg: 'Show all bootcamps'
    //         })

    // } catch (err) {
    //     res.status(400)
    //         .json({
    //             success: false,
    //             msg: 'Bad Request'
    //         })
    // }
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

    // Cheak for published bootcamp
    const publishedBootcamp = await Bootcamps.findOne({ user: req.user.id })

    //if the user is not an admin they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(
            `They user ID ${req.user.id} has already published a bootcamp`, 
            400))
    }


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
    const user = req.user.id
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
        acceptGi: acceptGi,
        user: user
    })
    const data = await bootcamp.save()

    res.status(201).json({
        success: true,
        msg: `Create new bootcamp`,
        data: data
    })

})

//@desc PUT  Update Bootcamp 
//@route  PUT /api/v1/bootcamps/:Id
//@access Public

exports.updateBootcamps = async (req, res, next) => {
    try {
        const bootcamp_id = req.params.id
        let bootcamp = await Bootcamps.findById(req.params.id)


        if (!bootcamp) {
            res.status(404)
                .json({
                    success: false,
                    msg: `Bootcamp not found ${req.params.id}`
                })
        }
        //Make sure user is bootcamp owner
        if(bootcamp.user.toString() !== req.user.id && req.user.role !=='admin'){
            return next(
                new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`,401)
            )
        }
         bootcamp = await Bootcamps.findByIdAndUpdate(req.params.id, { $set: req.body }, {
            new: true,
            runValidators: true
        })

        res.status(200)
            .json({
                success: true,
                data: bootcamp,
                msg: `Updated bootcamp ${req.params.id}`
            })      
    } catch (err) {
        next(err)

    }

}

//@desc DELETED  Update Bootcamp 
//@route  DELETED /api/v1/bootcamps/:Id
//@access Public

exports.deletedBootcamps = asyncHandler(async (req, res, next) => {
  
    const bootcamp_id = req.params.id

    let bootcamp = await Bootcamps.findById(bootcamp_id)



      //Make sure user is bootcamp owner
      if(bootcamp.user.toString() !== req.user.id && req.user.role !=='admin'){
        return next(
            new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`,401)
        )
    }

    await Bootcamps.deleteOne({ _id: bootcamp_id })

    res.status(200)
        .json({
            success: true,
            // data: bootcamp,
            msg: `Deleted bootcamp ${req.params.id}`
        })


})


//@desc   Update Bootcamp 
//@route  PUT /api/v1/bootcamps/:Id/photo
//@access Private

exports.UploadBootcampPhoto = asyncHandler(async (req, res, next) => {
    const bootcamp_id = req.params.id
    const bootcamp = await Bootcamps.findById(bootcamp_id)
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${bootcamp_id}`)
        )
    }
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400))
    }

  //Make sure user is bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !=='admin'){
    return next(
        new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`,401)
    )
}
    // Cheaking file type
    const file = req.files.file
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload a image file`, 400))

    }
    //Cheak file size
    if (file.size < process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
    }
    //Create file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(new ErrorResponse(`Problem with upload a image file`, 500))
        }
        const bootcampdata = await Bootcamps.findByIdAndUpdate(bootcamp_id, { photo: file.name })
        res.status(200)
            .json({
                success: true,
                data: bootcampdata,
                msg: `Update bootcamp ${req.params.id}`
            })
    })
})