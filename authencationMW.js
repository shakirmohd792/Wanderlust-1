const ExpressError = require("./utils/ExpressError");
const Listing = require('./model/listing.js')
const {listingSchema, reviewSchema} = require('./schema.js')
const Review = require('./model/review.js');
const wrapAsync = require("./utils/wrapAsync.js");

// Authentication
module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        throw new ExpressError(400, "you must be logged in to create listings")
    }
    next();
}

// Requires owners perssion to modified data
module.exports.isOwner = async (req, res, next)=>{
    let {id}= req.params
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
       return res.json({error:"Your are not the owner of this listing"})
    }
    next();
}

// joi validation for listing
module.exports.validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// joi validation for review
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// Requires authers perssion to delete data
module.exports.isAuthor = wrapAsync(async (req, res, next)=>{
    let {reviewId}= req.params
    let review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
      throw new ExpressError(400, "You are not the author of this review")
    }
    next();
})
 