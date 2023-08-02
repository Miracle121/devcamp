const express = require('express')
const bootcamps = require('../controllers/bootcamps')
const router = express.Router()

router.get('/', bootcamps.getBootcamps)
router.get('/:id',bootcamps.getBootcampsById )
router.post('/', bootcamps.createBootcamps)
router.put('/:id', bootcamps.updateBootcamps)
router.delete('/:id',bootcamps.deletedBootcamps)
module.exports = router