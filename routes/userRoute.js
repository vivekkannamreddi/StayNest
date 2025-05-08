const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const wrapAsync = require("../utility/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/userController.js");


router.route("/signup")
    .get(userController.renderSignupUser)
    .post(wrapAsync(userController.signupUser))


router.route("/login")
    .get(userController.renderLoginUser)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(userController.loginUser))


router.get("/logout",userController.logoutUser)


module.exports = router;