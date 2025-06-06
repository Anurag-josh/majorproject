const User=require("../models/user.js");

//render signup form
module.exports.renderSignupForm=(req,res)=>{
    res.render("../views/users/signup.ejs");
 };

 //signup user
 module.exports.signupUser=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newuser=new User({username,email});
        const registereduser=await User.register(newuser,password);
        // console.log(registereduser);
         req.login(registereduser,(err)=>{
         if(err){
            return next(err);
         }
         req.flash("success","welcome to Ezsaty");
        res.redirect("/listings");
        });
    }catch(e){
        req.flash("fail",e.message);
        res.redirect("/signup");
    }
 };

 //render login form
 module.exports.renderLoginForm=(req,res)=>{
    res.render("../views/users/login.ejs");
 };

 //login user   
 module.exports.loginUser=async(req,res)=>{
    req.flash("success","welcome back to Ezsaty,You are logged in");
    // console.log(res.locals.redirectUrl );
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 };

 //logout user
 module.exports.logoutUser=(req,res,next)=>{
    req.logOut((err)=>{
       if(err){
          return next(err);
       }
       req.flash("success","you are successfully logged out");
       res.redirect("/listings");
    })
  };
 
