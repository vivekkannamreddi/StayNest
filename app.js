require("dotenv").config();
const express = require("express");
const List = require('./models/listing.js');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utility/wrapAsync.js");
const ExpressError = require("./utility/ExpressErrors.js");
const {listingSchemaJoi ,reviewSchemaJoi} = require("./schemaValidationJoi.js");
const listingRoute = require("./routes/listingRoute.js");
const reviewRoute = require('./routes/reviewRoute.js');
const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRoute = require("./routes/userRoute.js")
const connectdb = require('./database/db.js');






    
const app = express();
const port = process.env.PORT || 3000;

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));





connectdb().then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch((error) => {
    console.log("Failed to connect to MongoDB Atlas", error);
});
    
const validateListing = (req,res,next)=>{
    let {error}= listingSchemaJoi.validate(req.body);
    
    if(error){
        let errorMessage = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error)
    }else{
        next();
    }
}

const dburl = process.env.mongoURI;

const store =MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})
store.on("error",(err)=>{
    console.log("error in mongo session store",err)
})
const sessionOptions = {
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
}



app.use(session(sessionOptions));
app.use(flash());

//for user to stay login implementing passport below session
app.use(passport.initialize())//before using passport we initialize it
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})



app.use("/listings",listingRoute)
app.use("/listings/:id/review",reviewRoute)
app.use("/",userRoute);



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