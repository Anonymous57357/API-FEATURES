// uncaughtException
process.on("uncaughtException", (err) => {
  console.log(`${err.name} ${err.message}`.red.underline);
  console.log("uncaught Exception occured! Shutting down...");
  process.exit(1);
});

const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const http = require("http");

// database connection
const connectDB = require("./config/dbConnect");
connectDB();

const server = http.createServer(app);

const PORT = 3000 || process.env.PORT;

server.listen(
  3000,
  console.log(`server is listening on PORT ${PORT}`.yellow.bold)
);
