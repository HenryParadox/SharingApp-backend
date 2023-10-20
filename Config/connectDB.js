const mongoose = require("mongoose");

const connectDB = async (DATABASE_URL) => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Connected to Database");
  } catch (err) {
    console.log("Please connect Database" + err);
  }
};

module.exports = connectDB;
