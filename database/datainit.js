const connectdb = require("./db.js");
const List = require("../models/listing.js");
// const sampleListings = require("../init/data.js");
const { data: sampleListings } = require("../init/data.js"); 

const seedData = async () => {
  try {
    await connectdb();
    await List.deleteMany(); // Clear existing listings (optional)
    await List.insertMany(sampleListings);
    console.log("Listings inserted successfully!");
    process.exit();
  } catch (error) {
    console.error("Error inserting listings:", error);
    process.exit(1);
  }
};

seedData();
