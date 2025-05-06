const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const wrapAsync = require("../utility/wrapAsync.js");
const passport = require("passport");

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
    req.flash("success","Registration Successful");
    res.redirect("/listings")
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup")
    }
}))




router.get("/login",(req,res)=>{
    res.render("./authentication/login.ejs");
})



router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(async(req,res)=>{
    // try{
    //     let {username,email,password}=req.body;
    // const newuser = new User({
    //     username,email,
    // });
    // const registeredUser =  await User.register(newuser,password);
    // console.log(registeredUser);
    // req.flash("success","Registration Successful");
    // res.redirect("/listings")
    // }catch(error){
    //     req.flash("error",error.message);
    //     res.redirect("/signup")
    // }

    req.flash("success","working");
    res.redirect("/listings")
}))



module.exports = router;