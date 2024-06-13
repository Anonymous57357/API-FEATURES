const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DATABASE_CONN, {});
  console.log(
    `database connected successfully...${conn.connection.host}`.cyan.underline
      .bold
  );
};

// globally created unhandled rejection
// gloally handling the unhandled rejection
process.on("unhandledRejection", (err) => {
  console.log(`${err.name} ${err.message}`.red.underline);
  console.log("unhandled rejection occured! Shutting down...");
  process.exit(1); // 0 for success and 1 for uncaught execptions
});

module.exports = connectDB;
