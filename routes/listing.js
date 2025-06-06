const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressErrors.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isloggedin,isOwner }=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const {storage}=require("../cloudConfig.js");

const multer  = require('multer');
const upload = multer({ storage });


const validateListing = (req, res, next) => {
    //  console.log(req.body);
    let { error } = listingSchema.validate(req.body); 
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errmsg);
    }else{
    next();
    }
};


//new listing form 
router.get("/new", isloggedin,listingController.renderNewForm);

router.route("/")
.get(wrapAsync(listingController.index))
.post(upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));




router.route("/:id")
.get(wrapAsync(listingController.showListing))
.patch(isloggedin,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isloggedin,isOwner,wrapAsync(listingController.deleteListing));

//edit route
router.get("/:id/edit",isloggedin,isOwner,wrapAsync(listingController.renderEditForm));
  
  module.exports=router;