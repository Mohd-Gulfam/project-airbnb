
const User = require("../models/user.js");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup"); 
}

module.exports.signup = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }   
            req.flash("success", "Welcome to AIRBNB!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
}

module.exports.login =  async (req, res) => {
    req.flash("success", "Login successful!");
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {       
        if (err) {
            return next(err);
        }   
        req.flash("success", "You have been logged out!");
        res.redirect("/login");
    });
}