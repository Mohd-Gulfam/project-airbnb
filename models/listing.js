const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");




const listingSchema = new mongoose.Schema({
  title: String,
  description: String,

  image: {
    url: String,
    filename: String,

  },

  price: Number,
  location: String,
  country: String,
  

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {

  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
})



// const listingSchema = new Schema({
//     title: {
//         type: String,
//         require: true,
//     } ,
    
//     description: String,
//     image: {
   //  type: String,
//         default: "https://unsplash.com/photos/a-person-swimming-in-the-ocean-with-a-camera-NhWxAIs61MM",
//         
//         set: (v) =>
//             v===""? "https://unsplash.com/photos/a-person-swimming-in-the-ocean-with-a-camera-NhWxAIs61MM": v,        
//     },
//     price: Number,
//     location: String,
//     country: String,

// });

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
