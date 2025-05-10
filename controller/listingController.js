const express = require("express");
const router = express.Router({mergeParams:true});
const List = require('../models/listing.js');
const wrapAsync=require("../utility/wrapAsync.js");
const {isLoggedIn,isOwnerEditDelete,validateListing } = require("../middleware.js")


module.exports.index=async(req,res)=>{
    const allLists =  await List.find({});
    res.render("./listings/index.ejs",{allLists});
}


module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new")
}

module.exports.showListing=async (req,res)=>{
    let {id} = req.params;
    const listing = await List.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings")
    }
    res.render("./listings/show.ejs",{listing})
}


module.exports.createListing=async (req,res,next)=>{
    // if(!req.body.title||!req.body.description||!req.body.image||!req.body.price||!req.body.location||!req.body.country){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    let {title,description,image,price,location,country}= req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new List({
        title:title,
        description:description,
        image:{url:image},
        price:price,
        location:location,
        country:country,
    });
    newlisting.owner = req.user._id;
    newlisting.image = {filename,url}
    await newlisting.save();
        req.flash("success","New Listing created")
        res.redirect("/listings");
    
    }



module.exports.editForm=async (req,res)=>{
    let {id} = req.params;
    const listing = await List.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings")
    }

    let originalImage = listing.image.url;
    originalImage=originalImage.replace("/upload","/upload/h_250,w_250")

    res.render("./listings/edit.ejs",{listing,originalImage});
}

module.exports.updateListing = async (req, res) => {
    let { title, description, image, price, location, country } = req.body.listing;
    let { id } = req.params;

    let updated = await List.findById(id);

    if (typeof req.file === "undefined") {
        image = updated.image.url; 
    } else {
        image = req.file.path;
    }

    updated.title = title;
    updated.description = description;
    updated.image = { url: image };
    updated.price = price;
    updated.location = location;
    updated.country = country;


    await updated.save();

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};



module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedlisting = await List.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted")
    res.redirect("/listings")
}