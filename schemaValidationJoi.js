const joi = require("joi");

module.exports.listingSchemaJoi = joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        price:joi.string().required().min(0),
        country:joi.string().required(),
        location:joi.string().required(),
        image:joi.string().required(),
    }).required(),
})



module.exports.reviewSchemaJoi = joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required(),
    }).required(),
})