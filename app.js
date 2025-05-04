const express = require("express");
const mongoose = require("mongoose");
const List = require('./models/listing.js');
const path = require("path");
const mo = require("method-override");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


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
    try{
    let {title,description,image,price,location,country}= req.body;
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
    } catch (err) {
        console.error("Error saving listing:", err);
        res.send("Failed to save listing");
    }

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
})

//delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedlisting = await List.findByIdAndDelete(id);
    console.log(deletedlisting)
    res.redirect("/listings")
})






app.get('/listings',(req,res)=>{
    res.send("wokring");
})

app.listen(port,(req,res)=>{
    console.log("server is listening at port 3000...");
})