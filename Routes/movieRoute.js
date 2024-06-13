const {
  createMovies,
  getMovies,
  getMovie,
  patchMovie,
  putMovie,
  deleteMovie,
  getMovieStats,
  getMovieGenreStats,
  getMovieRatings,
  getHighRatedImdb,
} = require("./../controllers/movieController");

const { protect, restrict } = require("./../controllers/authController");

const express = require("express");

const movieRouter = express.Router();

// high-rated
// movieRouter.route("/high-ratedImdb").get(getHighRatedImdb);

// getMovie-stats
// movieRouter.route("/movies-stats").get(getMovieStats);

// getMovieGenre
movieRouter.route("/movies-by-genre/:genre").get(getMovieGenreStats);

// getMovieLanguage
movieRouter.route("/movies-by-language/:ratings").get(getMovieRatings);

// CRUD operations
movieRouter.route("/").post(createMovies).get(protect, getMovies);
movieRouter
  .route("/:id")
  .get(protect, getMovie)
  .patch(patchMovie)
  .put(putMovie)
  .delete(protect, restrict("user"), deleteMovie); // authentication --> athorization --> then delete the movie

module.exports = movieRouter;
