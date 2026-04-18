if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodeOverride =require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");


const userRoutes = require("./routes/user.js");
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const { get } = require("http");

// const mongo_URL= "mongodb://127.0.0.1:27017/wanderlust"
const dbs_url = process.env.MONGO_ATLAS_URL ;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) =>{
    console.log(err);
  })

async function main() {
  await mongoose.connect(dbs_url)
  // await mongoose.connect(mongo_URL)
    
}

app.set("view engine", "ejs" );
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodeOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbs_url,
  crypto: {
    secret: process.env.SECRET_KEY,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", function(e){
  console.log("session store error", e);
});


const sessionOption = {
  store,
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,

  },
};



// session and flash configuration
app.use(session(sessionOption));
app.use(flash());

// passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});



// routes
app.use("/", userRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);





app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
  let {statusCode = 500,message = "something went wrong"} = err;
  res.status(statusCode).render("error.ejs", {message});
  // res.status(statusCode).send(message);
});


app.listen(8080, () =>{
    console.log("Server is listing to port 8080");

});

