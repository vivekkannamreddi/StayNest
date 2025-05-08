const List = require("./models/listing.js")
const ExpressError = require("./utility/ExpressErrors.js")
const {listingSchemaJoi,reviewSchemaJoi } = require("./schemaValidationJoi.js")
const Review = require('./models/review.js');


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url for post login
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to Create new Listing!");
        return res.redirect("/login");
    }
    next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isOwnerEditDelete=async(req,res,next)=>{
    let {id} = req.params;
    let listings = await List.findById(id);
    if(!listings.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have access to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isAuthorReview=async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have access to delete");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing = (req,res,next)=>{
    let {error}= listingSchemaJoi.validate(req.body);
    
    if(error){
        let errorMessage = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error)
    }else{
        next();
    }
}


module.exports.validateReview = (req,res,next)=>{
    let {error}= reviewSchemaJoi.validate(req.body);
    
    if(error){
        let errorMessage = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error)
    }else{
        next();
    }
}


