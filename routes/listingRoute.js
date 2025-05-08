const express = require("express");
const router = express.Router({mergeParams:true});
const List = require('../models/listing.js');
const wrapAsync=require("../utility/wrapAsync.js");
const {isLoggedIn,isOwnerEditDelete,validateListing } = require("../middleware.js");
const listingController = require("../controller/listingController.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})



//Router.route

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,validateListing,upload.single("listing[image]"),wrapAsync(listingController.createListing))
    

//new route
router.get("/new",isLoggedIn,validateListing,wrapAsync(listingController.renderNewForm))

router.route("/:id")
    .get(validateListing,wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwnerEditDelete,validateListing,upload.single("listing[image]"),wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwnerEditDelete,isLoggedIn,wrapAsync(listingController.destroyListing))


//edit route
router.get("/:id/edit",isLoggedIn,isOwnerEditDelete,validateListing,wrapAsync(listingController.editForm))

module.exports = router;