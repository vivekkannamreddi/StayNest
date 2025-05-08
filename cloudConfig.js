const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require("dotenv").config();

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
  console.log("Cloudinary loaded:", process.env.CLOUD_NAME, process.env.CLOUD_API_KEY ? "KEY_PRESENT" : "MISSING");


  module.exports={
    cloudinary,storage
  }