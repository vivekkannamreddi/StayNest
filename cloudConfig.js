const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require("dotenv").config();

// Ensure all necessary environment variables are loaded
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  console.error("Missing Cloudinary configuration environment variables!");
  process.exit(1); // Terminate the app if critical env vars are missing
}

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'StayNest',
      allowedFormats:["png","jpg","jpeg"]
    },
  });
  


  module.exports={
    cloudinary,storage
  }