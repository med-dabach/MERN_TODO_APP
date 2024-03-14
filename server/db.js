const mongoose = require("mongoose");

const uri = process.env.DB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

module.exports = mongoose;
