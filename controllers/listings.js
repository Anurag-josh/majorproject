const Listing = require("../models/listing.js");


//index route
module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
};

//new listing form 
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//cretenew listing
module.exports.createListing=async (req,res)=>{ 

    let url=req.file.path;
    let filename=req.file.filename;
        
    const { listing } = req.body;
    const defaultImageUrl = "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJlYWNoJTIwaG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60";

    if (!listing) {
    throw new ExpressError(400, "Invalid listing data");
     }

    const priceValue = parseFloat(listing.price);
    if (isNaN(priceValue)) {
    throw new ExpressError(400, "Invalid price value");
    }

    const newListing = new Listing({
    title: listing.title,
    description: listing.description,
    image: { 
      url: listing.image || defaultImageUrl,
      filename: 'default-filename'
    },
    price: priceValue,
    country: listing.country,
    location: listing.location
    });
    
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","new listing created");
    res.redirect("/listings");  
};

//show listing
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
       
    const defaultImageUrl = "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJlYWNoJTIwaG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60";

    if (!listing) {
      req.flash("error", "Listing requested does not exists");
      return res.redirect("/listings"); 
    }
    res.render("listings/show.ejs", { listing });
}

//edit form
module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing requested does not exists");
      return res.redirect("/listings"); 
    }
    // Convert string image to object if needed
    if (typeof listing.image === 'string') {
        listing.image = {
            url: listing.image,
            filename: 'default-filename'
        };
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing,originalImageUrl });
};

//update listing
module.exports.updateListing=async (req,res)=>{
    // console.log(req.body);
    
      if(!req.body.listing){
          throw new ExpressError(400,"send valid data for listing");
      }
      let { id }=req.params;
      let {title,description,image,price,country,location}=req.body.listing;
    //   console.log("Update route - Received image:", image);
    
      const updatedListing = await Listing.findByIdAndUpdate(id,{
          title,
          description,
          image: { 
              url: image,
              filename: 'default-filename'  // Adding a filename since it's in the schema
          },
          price,
          country,
          location
      },{runValidators:true, new: true});  


      if(typeof req.file !== 'undefined'){
      let url=req.file.path;
     let filename=req.file.filename;
     updatedListing.image={url,filename};
      await updatedListing.save();
      }
      req.flash("success","Listing Edited sucessfully");
    //   console.log("Update route - New image data:", updatedListing.image);
      res.redirect(`/listings/${id}`);
      }

//delete listing
module.exports.deleteListing=async(req,res)=>{
    let { id }=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted sucessfully");
    res.redirect("/listings");
};
