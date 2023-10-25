const express = require('express')
const auth = require('../controllers/auth')


const { protect } = require('../middleware/auth')
const router = express.Router()

router.post('/register', auth.register)
router.post('/login', auth.login)
router.get('/logout', auth.logout)
router.get('/getme', protect, auth.getMe)

router.put('/updatedetails', protect, auth.updateUserDetails)
router.put('/updatepassword', protect, auth.updatePassword)

router.post('/forgotpassword', auth.forgotpassword)

router.put('/resetpassword/:resettoken', auth.resetPassword)
// router.post('/', course.createCours)
// router.put('/:id', course.updateCours)
// router.delete('/:id',course.deletedCours)

module.exports = router