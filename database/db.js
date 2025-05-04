const mongoose = require("mongoose");
const { mongoURI } = require("../config.js");  

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log("MongoDB connected:", conn.connection.host);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};



module.exports = connectdb;
