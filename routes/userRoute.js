const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const wrapAsync = require("../utility/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("./authentication/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newuser = new User({
        username,email,
    });
    const registeredUser =  await User.register(newuser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err)
        }
        req.flash("success","Registration Successful");
        res.redirect("/listings")
    })
    
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup")
    }
}))




router.get("/login",(req,res)=>{
    res.render("./authentication/login.ejs");
})



router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(async(req,res)=>{
    req.flash("success","Wellcome to StayNest..");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}))

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","You are successfully logged out");
        res.redirect("/listings");
    })
})


module.exports = router;