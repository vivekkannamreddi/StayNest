const List = require('../models/listing.js');
const Review = require('../models/review.js');


module.exports.createReview=async(req,res)=>{
    let {id}= req.params;
    let listing = await List.findById(id);
    let newreview = new Review(req.body.review);
    newreview.author=req.user._id;
    console.log(newreview)
    listing.review.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","New Review Added")
    res.redirect(`/listings/${id}`)
    
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId} = req.params;
    await List.findByIdAndUpdate(id,{$pull:{review:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted")
    res.redirect(`/listings/${id}`)
}