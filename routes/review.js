const express = require('express')
const review = require('../controllers/review')
const Reviews = require('../models/Review')
const advancedResults = require('../middleware/advancedResult')
const {protect,authorize} = require('../middleware/auth')
const router = express.Router({mergeParams:true})


router.get('/', advancedResults(Reviews,{
    path: 'bootcamp',
    select: ' name , description'
}),review.getReview)


router.get('/:id',review.getReviewById )

router.post('/', protect, authorize('user','publisher','admin'),review.createReview)

router.put('/:id', protect, authorize('user','admin'),review.updateReview)

router.delete('/:id',protect, authorize('user','admin'),review.deletedReview)


module.exports = router