const express = require('express')
const bootcamps = require('../controllers/bootcamps')
const coursesRout = require('./course')
const reviewRout = require('./review')
const Bootcamps = require('../models/Bootcamps')
const advancedResults = require('../middleware/advancedResult')
const {protect,authorize} = require('../middleware/auth')
const router = express.Router()

router.get('/',protect,advancedResults(Bootcamps,'courses') ,bootcamps.getBootcamps)
router.get('/:id',protect,bootcamps.getBootcampsById )
router.post('/', protect,authorize('publisher','admin'),bootcamps.createBootcamps)
router.put('/:id', protect,authorize('publisher','admin'),bootcamps.updateBootcamps)

router.put('/:id/photo',protect,authorize('publisher','admin') ,bootcamps.UploadBootcampPhoto)

router.delete('/:id',protect,authorize('publisher','admin'),bootcamps.deletedBootcamps)
// Re-rout into other resource routers
router.use('/:id/courses',coursesRout)
router.use('/:id/review',reviewRout)

module.exports = router