const express = require("express");
const mongoose = require("mongoose");
const List = require('./models/listing.js');
const path = require("path");
const mo = require("method-override");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utility/wrapAsync.js");
const ExpressError = require("./utility/ExpressErrors.js")
const {listingSchemaJoi} = require("./schemaValidationJoi.js")
const joi = require("joi")

const connectdb = require('./database/db.js');
connectdb().then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch((error) => {
    console.log("Failed to connect to MongoDB Atlas", error);
});


    
const app = express();
const port = process.env.PORT || 3000;




app.engine("ejs",ejsMate)


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")))

// main().then((result)=>{
//     console.log("connection established...");
// }).catch((error)=>{
//     console.log("connection failed..");
// })

// async function main(){
//     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
// }

    
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
app.get('/listings',validateListing,wrapAsync(async(req,res)=>{
    const allLists =  await List.find({});
    res.render("./listings/index.ejs",{allLists});
}))


//new route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs")
})

//show route
app.get('/listings/:id',validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await List.findById(id);
    res.render("./listings/show.ejs",{listing})
}))


//create route
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
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
        console.log("Listing saved:", newlisting);
        res.redirect("/listings");
    
    }

))

//edit route
app.get("/listings/:id/edit",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await List.findById(id);
    res.render("./listings/edit.ejs",{listing});
}))

    
//update route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
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
    res.redirect("/listings");
}))

//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedlisting = await List.findByIdAndDelete(id);
    console.log(deletedlisting)
    res.redirect("/listings")
}))




app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("./ErrorPage/error.ejs",{message})
})



app.get('/',validateListing,wrapAsync(async (req,res)=>{
    const allLists =  await List.find({});
    res.render("./listings/index.ejs",{allLists});
    
}))

app.listen(port,(req,res)=>{
    console.log("server is listening at port 3000...");
})



app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
});