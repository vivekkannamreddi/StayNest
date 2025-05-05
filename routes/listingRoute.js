const express = require("express");
const router = express.Router({mergeParams:true});
const List = require('../models/listing.js');
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError = require("../utility/ExpressErrors.js")
const {listingSchemaJoi } = require("../schemaValidationJoi.js")



const validateListing = (req,res,next)=>{
    let {error}= listingSchemaJoi.validate(req.body);
    
    if(error){
        let errorMessage = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error)
    }else{
        next();
    }
}

//index route
router.get('/',validateListing,wrapAsync(async(req,res)=>{
    const allLists =  await List.find({});
    res.render("./listings/index.ejs",{allLists});
}))


//new route
router.get("/new",(req,res)=>{
    res.render("./listings/new.ejs")
})

//show route
router.get('/:id',validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await List.findById(id).populate("review");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings")
    }
    res.render("./listings/show.ejs",{listing})
}))



//create route
router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    // if(!req.body.title||!req.body.description||!req.body.image||!req.body.price||!req.body.location||!req.body.country){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    let {title,description,image,price,location,country}= req.body.listing;
    const newlisting = new List({
        title:title,
        description:description,
        image:{url:image},
        price:price,
        location:location,
        country:country,
    })
    await newlisting.save();
        req.flash("success","New Listing created")
        res.redirect("/listings");
    
    }

))

//edit route
router.get("/:id/edit",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await List.findById(id);
    console.log("hello")
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings")
    }
    res.render("./listings/edit.ejs",{listing});
}))

    
//update route
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    // if(!req.body.title||!req.body.description||!req.body.image||!req.body.price||!req.body.location||!req.body.country){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    let {title,description,image,price,location,country}= req.body.listing;
    const newlisting = new List({
        title:title,
        description:description,
        image:{url:image},
        price:price,
        location:location,
        country:country,
    })
    let {id} = req.params;
    await List.findByIdAndUpdate(id,{
        title:title,
        description:description,
        image:{url:image},
        price:price,
        location:location,
        country:country,
    })
    req.flash("success","Listing Updated")
    res.redirect("/listings");
}))

//delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedlisting = await List.findByIdAndDelete(id);
    console.log(deletedlisting)
    req.flash("success"," Listing Deleted")
    res.redirect("/listings")
}))


module.exports = router;