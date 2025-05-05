const express = require("express");
const router = express.Router({mergeParams:true});
const List = require('../models/listing.js');
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError = require("../utility/ExpressErrors.js")
const {reviewSchemaJoi} = require("../schemaValidationJoi.js")
const Review = require('../models/review.js');



const validateReview = (req,res,next)=>{
    let {error}= reviewSchemaJoi.validate(req.body);
    
    if(error){
        let errorMessage = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error)
    }else{
        next();
    }
}




//reviews route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let listing = await List.findById(id);
    let newreview = new Review(req.body.review);
    listing.review.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","New Review Added")
    res.redirect(`/listings/${id}`)
    
}))


//delete review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await List.findByIdAndUpdate(id,{$pull:{review:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted")
    res.redirect(`/listings/${id}`)
}))


module.exports=router;