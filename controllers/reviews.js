const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressErrors.js");

//post review
module.exports.createReview=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Assuming req.user is set by passport
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review added sucessfully");
    res.redirect(`/listings/${id}`);
};

//delete review
module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted sucessfully");
    res.redirect(`/listings/${id}`);
};