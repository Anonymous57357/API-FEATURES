const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
const Movie = require("../Models/movieModel");
const fs = require("fs");

dotenv.config({ path: "./config/config.env" });
mongoose.connect(process.env.DATABASE_CONN, {}).then((conn) =>
  console.log(`database connected successfully...`).catch((err) => {
    console.log(`Some error has occured `);
  })
);

// READ MOVIES FROM THE MOVIES.JSON file
const movie = JSON.parse(fs.readFileSync("../data/movies.json", "utf-8"));

// delete existing document from the collection

const deleteMovies = async () => {
  try {
    await Movie.deleteMany();
    console.log("Movie Data is successfully deleted!!".red.bold);
  } catch (err) {
    console.log(err.message);
  }
};

// import the documents from the collecitons
const importMovies = async () => {
  try {
    await Movie.create(movie);
    console.log("Movie Data is successfully imported!!".green.bold);
  } catch (err) {
    console.log(err.message);
  }
};

if (process.argv === "--import") {
  importMovies();
} else if (process.argv === "--delete") {
  deleteMovies();
}

console.log(process.argv);
