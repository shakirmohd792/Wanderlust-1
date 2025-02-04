const Joi = require('joi');

// joi validation for listings
module.exports.listingSchema = Joi.object({
    //   listing: Joi.object({
         title: Joi.string().required(),
         description: Joi.string().required(),
         image: Joi.string().allow("", null),
         price: Joi.number().required(),
         location: Joi.string().required(),
         country: Joi.string().required()
    //   }).required(),
});

// joi validation fro reviews

module.exports.reviewSchema = Joi.object({
        //  reviews: Joi.object({
         rating: Joi.number().required().min(1).max(5),
         comment: Joi.string().required()
        // }).required()
});


      
  