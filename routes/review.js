const express = require("express");
const router = express.Router({ mergeParams: true }); // Add mergeParams: true
const wrapAsync = require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressErrors.js");
const {  reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview }=require("../middleware.js");
const { isloggedin,isOwner,isreviewAuthor }=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");



// POST review route
router.post("/", isloggedin,validateReview, wrapAsync(reviewController.createReview));

// DELETE review route
router.delete("/:reviewId", isloggedin,isreviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;