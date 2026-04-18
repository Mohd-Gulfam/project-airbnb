const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema } = require("../schema.js");
const { isLoggedIn,isAuthor,validateListing } = require("../middleware.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");




//Index Route
router.route("/")
  .get( wrapAsync(listingController.index))
  //create Route
  .post( isLoggedIn,  upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));
 
  
//new route
router.get("/new",isLoggedIn, wrapAsync(listingController.renderNewForm));


//Edit Route
router.get("/:id/edit" ,isLoggedIn,isAuthor, wrapAsync(listingController.renderEditForm));

// SEARCH ROUTE

router.get("/search", async (req, res) => {
    let { location } = req.query;

    try {
        let allListings = await Listing.find({
            $or: [
                { location: { $regex: location, $options: "i" } },
                { country: { $regex: location, $options: "i" } }
            ]
        });

        res.render("listings/index.ejs", { allListings });

    } catch (err) {
        console.log(err);
        res.redirect("/listings");
    }
});

router
.route("/:id")
  //Show Route
  .get(isLoggedIn, wrapAsync(listingController.showListing))
  //update Route
  .put(isLoggedIn, isAuthor,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
  //Delete Rought
  .delete(isLoggedIn, isAuthor, wrapAsync(listingController.deleteListing));

module.exports = router;