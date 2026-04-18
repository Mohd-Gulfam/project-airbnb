const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// signup routes
router.get("/signup", userController.renderSignupForm);

// handle signup form submission
router.post("/signup",wrapAsync(userController.signup)); 

// login routes
router.get("/login", userController.renderLoginForm);

// handle login form submission with passport authentication
router.post("/login",saveRedirectUrl, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
 }),userController.login);

// logout route
router.get("/logout", userController.logout);    


module.exports = router;