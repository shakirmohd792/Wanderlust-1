const Review = require('../model/review.js')
const Listing = require('../model/listing.js')

module.exports.createReview = async (req, res) => {
    let { comment, rating } = req.body
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review({ comment, rating, author: req.user._id })
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    res.json(newReview)
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.json({ success: "Review deleted" })
};