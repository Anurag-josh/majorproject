if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express= require("express");
const app =express();
const mongoose = require("mongoose");
const port=8080;
const path=require("path")
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate");//used to creat boiler plate code
const ExpressError=require("./utils/ExpressErrors.js");
const listingRoutes = require("./routes/listing.js");
const reviewsRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require("passport");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local");



app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs', ejsMate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dburl=process.env.ATLASDB_URL;


const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err); 
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
}







// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
// const dburl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dburl);
}

// app.get("/",(req,res)=>{
//     res.send("OK")
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});



app.get("/deleteallusers", async (req, res) => {
    await User.deleteMany({});
    res.send("All users deleted");
  });




app.use("/listings", listingRoutes); 
app.use("/listings/:id/reviews", reviewsRoute); 
app.use("/",userRoute);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
    
    // res.status(statusCode).send(message);
})


app.listen(port,()=>{
 console.log("working");
});