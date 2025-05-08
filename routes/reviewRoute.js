const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utility/wrapAsync.js");
const {validateReview,isLoggedIn, isAuthorReview} = require("../middleware.js")
const reviewController = require("../controller/reviewController.js");



//reviews route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

//delete review route
router.delete("/:reviewId",isLoggedIn,isAuthorReview,wrapAsync(reviewController.destroyReview))


module.exports=router;