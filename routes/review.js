const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { validateReview, isLoggedIn, isAuthor } = require('../authencationMW.js')
const reviewController = require('../controllers/review.js')

// Review post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

// Review delete route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router