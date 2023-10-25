const express = require('express')
const User = require('../models/User')
const user= require('../controllers/user') 
const auth = require('../controllers/auth')
const { protect,authorize } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResult')
const router = express.Router()

router.use(protect)
router.use(authorize('admin'))

router.get('/', advancedResults(User),user.getUsers)

router.get('/:id',user.getUsersById )

router.post('/',user.createUsers)

router.put('/:id', user.updateUsers)

router.delete('/:id',user.deletedUsers)

module.exports = router


module.exports = router