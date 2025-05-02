    const express = require("express");
    const mongoose = require("mongoose");
    const List = require('./models/listing.js');
    const path = require("path");
    const mo = require("method-override");
const methodOverride = require("method-override");
    
    const app = express();
    const port = 3000;

    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"views"));
    app.use(express.urlencoded({extended:true}));
    app.use(methodOverride("_method"));

    main().then((result)=>{
        console.log("connection established...");
    }).catch((error)=>{
        console.log("connection failed..");
    })

    async function main(){
        await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
    }

    


    // app.get('/testlisting',async (req,res)=>{
    //     let samplelisting = new List({
    //         title:"My new villa",
    //         description:"By the beach",
    //         price:1200,
    //         location:"Calangute , Goa",
    //         country:"India"
    //     })
    //     await samplelisting.save()
    //     .then((result)=>{
    //         console.log("saved to database successfully");
    //     }).catch((error)=>{
    //         console.log("failed to save in database");
    //     })
    // })




    //index route
    app.get('/listings',async(req,res)=>{
        const allLists =  await List.find({});
        res.render("./listings/index.ejs",{allLists});
    })


    //new route
    app.get("/listings/new",(req,res)=>{
        res.render("./listings/new.ejs")
    })

    //show route
    app.get('/listings/:id',async (req,res)=>{
        let {id} = req.params;
        const listing = await List.findById(id);
        res.render("./listings/show.ejs",{listing})
    })


    //create route
    app.post("/listings",async (req,res)=>{
        let {title,description,image,price,location,country}= req.body;
        const newlisting = new List({
            title:title,
            description:description,
            image:image,
            price:price,
            location:location,
            country:country,
        })
        await newlisting.save();
        res.redirect("/listings");

    })

    //edit route
    app.get("/listings/:id/edit",async (req,res)=>{
        let {id} = req.params;
        const listing = await List.findById(id);
        res.render("./listings/edit.ejs",{listing});
    })

    
    //update route
    app.put("/listings/:id",async (req,res)=>{
        let {title,description,image,price,location,country}= req.body;
        const newlisting = new List({
            title:title,
            description:description,
            image:image,
            price:price,
            location:location,
            country:country,
        })
        let {id} = req.params;
        await List.findByIdAndUpdate(id,{
            title:title,
            description:description,
            image:image,
            price:price,
            location:location,
            country:country,})
        res.redirect("/listings");
    })

    //delete route
    app.delete("/listings/:id",async (req,res)=>{
        let {id}=req.params;
        let deletedlisting = await List.findByIdAndDelete(id);
        console.log(deletedlisting)
        res.redirect("/listings")
    })






    app.get('/',(req,res)=>{
        res.send("wokring");
    })

    app.listen(port,(req,res)=>{
        console.log("server is listening at port 3000...");
    })