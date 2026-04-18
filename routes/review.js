const express = require("express");
const router = express.Router({mergeParams: true});

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const e = require("connect-flash");
const { isLoggedIn,validateReview,isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");




// post route for creating a new review for a listing
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// delete route for deleting a review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
  