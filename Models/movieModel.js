const mongoose = require("mongoose");
const { Schema } = mongoose;
const fs = require("fs");

//  Review Schema
const reviewSchema = new Schema({
  user: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  rating: { type: Number, min: 0, max: 10, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

//  Actor Schema
const actorSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  bio: { type: String },
});

// Movie Schema

const movieSchema = new Schema(
  {
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: [{ type: String, required: true }],
    releaseDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    plot: { type: String, required: true },
    language: { type: String, required: true },
    country: { type: String, required: true },
    rating: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    actors: [actorSchema],
    reviews: [reviewSchema],
    boxOffice: {
      budget: { type: Number, required: true },
      revenue: { type: Number, required: true },
    },
    ratings: {
      imdb: { type: Number, min: 0, max: 10 },
      rottenTomatoes: { type: Number, min: 0, max: 100 },
      metacritic: { type: Number, min: 0, max: 100 },
    },
    createdBy: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtuals
movieSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
});

// document middleware // targeting the document
movieSchema.pre("save", function (next) {
  // console.log(this);
  this.createdBy = "Mukesh";
  next();
});

// Post-save Middleware
movieSchema.post("save", function (doc, next) {
  console.log("A new user was created", doc);
  next();
});

// pre-remove Middleware
movieSchema.pre("remove", function (next) {
  console.log("A user is about to be romoved");
  next();
});

// post-remove Middleware
movieSchema.post("remove", function (doc, next) {
  console.log("User has been removed", doc);

  next();
});

// doucment middleware // post
// movieSchema.post("save", function (doc, next) {
//   const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}`;
//   console.log(content);
//   fs.writeFileSync(".../log/log.txt", content, { flag: "a" }, (err) => {
//     console.log(err.message);
//   });
//   next();
// });

//

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;

// const mongoose = require("mongoose");
// const validator = require("validator");
// const Schema = mongoose.Schema;
// const MovieSchema = new Schema({
//   name: {
//     type: String,
//     required: [true, "Name is required field!"],
//     unique: true,
//     maxlength: [100, "Movie name must not have more than 100 characters"],
//     minlength: [4, "Movie name must have atleast 4 characters"],
//     trim: true,
//   },
//   description: {
//     type: String,
//     required: [true, "Description is required field!"],
//     trim: true,
//   },
//   duration: {
//     type: Number,
//     required: [true, "duration is required field!"],
//     trim: true,
//   },
//   ratings: {
//     type: Number,
//   },
//   totalRatings: {
//     type: Number,
//   },
//   releaseYear: {
//     type: Number,
//     required: [true, "releaseYear is required field!"],
//   },
//   releaseDate: {
//     type: Date,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now(),
//   },
//   genres: {
//     type: [String],
//     required: [true, "Genres is required field"],
//   },
//   directors: {
//     type: [String],
//     required: [true, "Directors is required field!"],
//   },
//   coverImage: {
//     type: String,
//     required: [true, "Cover Image is required field!"],
//   },
//   actors: {
//     type: [String],
//     required: [true, "Actors is required field!"],
//   },
//   price: {
//     type: Number,
//     required: [true, "Price is required field!"],
//   },
//   languages: {
//     type: [String],
//     required: [true, "Languages is requiews field"],
//   },
// }, {
//   timestamps: true
// }, {
//   toJSON:
// });

// // mongoose api(aplication programming interface) VirtualType
// MovieSchema.virtual("duratinInHours").get(function (value, virtual, doc) {
//   // return doc.duration / 60;
//   return this.duration / 60
// });

// const Movie = mongoose.model("Movie", MovieSchema);
// module.exports = Movie;
