const Movie = require("./../Models/movieModel");
const CustomError = require("./../utils/CustomError");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");
// const checkCache = require("./../Middlewares/checkCache");

// const redis = require("redis");

// const redisClient = redis.createClient();
// redisClient.on("connect", () => {
//   console.log("connected to Redis");
// });

// redisClient.on("errror", (err) => {
//   console.error("Redis error", err);
// });

// const redis = require("redis"); // caching
// const util = require("util");

// const redisUrl = "redis://127.0.0.1:6379";
// const client = redis.createClient(redisUrl);
// client.set = util.promisify(client.set);

const getHighRatedImdb = asyncErrorHandler(async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = -"ratings.imdb";
  next();
});

// METHOD : POST
// URL: http://localhost:3000/api/v1/movies
const createMovies = asyncErrorHandler(async (req, res) => {
  const movie = await Movie.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      movie,
    },
  });
});

// METHOD : GET
// URL: http://localhost:3000/api/v1/movies
const getMovies = asyncErrorHandler(async (req, res) => {
  // console.log(req.query);

  // mongoose 6.0 or less // basic filtering
  /************************************************ */

  // mongoose 6.0 or less // basic filtering
  /************************************************ */
  // const excludedFields = ["sort", "page", "limit", "fields"];

  // console.log(req.query)

  // const queryObj = { ...req.query };

  // console.log(queryObj)

  // excludedFields.forEach((el) => {
  // delete queryObj[el];
  // });

  // const movies = await Movie.find(queryObj);
  /***************************************************** */

  /************************************************ */

  // advance filtering like gt|gte|lt|lte ascending and descending
  // find({duration: {$gte:106 }, ratings: {$gte:5 }, price: {lte:50 }})

  // console.log(req.query);
  // let queryStr = JSON.stringify(req.query);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // const queryObj = JSON.parse(queryStr);

  // console.log(queryObj);

  /***************************************************** */

  /***************************************************** */
  // let query = Movie.find(queryObj);

  // sorting result
  // if (req.query.sort) {
  // query = query.sort(req.query.sort);
  // }

  // const movies = await query;

  // mongoose spatial function
  // console.log(req.query);

  // #75 Excluding query object
  // const excludedFields = ["sort", "page", "limit", "fields"];

  // const queryObj = { ...req.query };

  // excludedFields.forEach((field) => {
  //   delete queryObj[field];
  // });

  // console.log(queryObj);

  // #76 advance filtering
  // find({duration:{$gte: 154}, rating: {$gt: 5.0}, genre: {$eq: Drama} })
  console.log(req.query);

  let queryStr = JSON.stringify(req.query);

  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt|eq)\b/g,
    (match) => `$${match}`
  );

  const queryObj = JSON.parse(queryStr);
  // console.log(queryObj);

  // #77 sorting result

  let query = Movie.find(queryObj);
  // SORTING LOGIC
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    // query.sort('rating duration')
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // LIMITING FIELDS
  if (req.query.fields) {
    // query.select("duration language country rating");
    const fields = req.query.fields.split(",").join(" ");
    console.log(fields);
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  // #79 PAGINATION
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  // page 1: 1 - 10, page 2: 11 - 20, page 3: 21 - 30 page 4: 31 - 40

  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const moviesCount = await Movie.countDocuments();
    if (skip >= moviesCount) {
      throw new Error("This page does not exist");
    }
  }

  const movies = await query;

  // const movies = await Movie.find()
  //   .where("duration")
  //   .gte(req.query.duration)
  //   .where("genre")
  //   .eq(req.query.genre)
  //   .where("rating")
  //   .gt(req.query.rating);

  res.status(200).json({
    status: "success",
    count: movies.length,
    data: {
      movies,
    },
  });
});

// METHOD : GET
// URL: http://localhost:3000/api/v1/movies:id
const getMovie = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  // console.log(x);

  if (!movie) {
    const error = new CustomError(
      `movie with the given id ${req.params.id} is not found`,
      404
    );
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: {
      movie,
    },
  });
});

// METHOD : PATCH
// URL: http://localhost:3000/api/v1/movies:id
const patchMovie = asyncErrorHandler(async (req, res, next) => {
  const patchedMovie = await Movie.findByIdAndUpdate(
    req.params.id,
    req.body.ratings,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!patchedMovie) {
    const error = new CustomError(
      `movie with the given id ${req.params.id} is not found`
    );
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: {
      patchedMovie,
    },
  });
});

// METHOD : PUT / UPDATE
// URL: http://localhost:3000/api/v1/movies:id
const putMovie = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedMovie) {
    const error = new CustomError(
      `movie with the given id ${req.params.id} is not found`
    );
    return next(error);
  }
  res.status(200).json({
    status: "success",
    data: {
      updatedMovie,
    },
  });
});

// METHOD : DELETE
// URL: http://localhost:3000/api/v1/movies:id
const deleteMovie = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const deletedMovie = await Movie.findByIdAndDelete(id);

  if (!deletedMovie) {
    const error = new CustomError(
      `movie with the given id ${req.params.id} is not found`
    );
    return next(error);
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
});

const getMovieStats = asyncErrorHandler(async (req, res, next) => {
  // match and group stages of aggreagation (business logic)

  const stats = await Movie.aggregate([
    { $match: { boxOffice: { $gt: 5000000 } } },
  ]);

  res.status(200).json({
    count: stats.length,
    message: "success",
    data: {
      stats,
    },
  });
});

// some more projections and operatiors

// METHOD : GET
// URL: http://localhost:3000/api/v1/movies/:genere
const getMovieGenreStats = asyncErrorHandler(async (req, res, next) => {
  const genre = req.params.genre;
  const movies = await Movie.aggregate([
    {
      $match: {
        genre: genre,
      },
    },
    {
      $unwind: {
        path: "$genre",
      },
    },
    {
      $group: {
        _id: 1,
        genre: {
          $first: "$genre",
        },
        totalScreen_time: {
          $sum: "$duration",
        },
        totalBoxoffice: {
          $sum: "$boxOffice.revenue",
        },
        totalBudget: {
          $sum: "$boxOffice.budget",
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  res.status(200).json({
    count: movies.length,
    message: "success",
    data: {
      movies,
    },
  });
});

// METHOD : GET
// URL: http://localhost:3000/api/v1/movies/:ratings

const getMovieRatings = asyncErrorHandler(async (req, res, next) => {
  const ratings = req.params.ratings;
  const movieRatings = await Movie.aggregate([]);

  res.status(200).json({
    count: movieLang.length,
    message: "success",
    data: {
      movieLang,
    },
  });
});

module.exports = {
  getHighRatedImdb,
  createMovies,
  getMovies,
  getMovie,
  patchMovie,
  putMovie,
  deleteMovie,
  getMovieStats,
  getMovieGenreStats,
  getMovieRatings,
};
