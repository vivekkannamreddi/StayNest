const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        filename: { type: String, default: "Staynest" },
        url: {
            type: String,
            default: "https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2018/08/16/Pictures/_dbca9ffa-a138-11e8-9345-8d51f8ed9678.jpg"
        },
        
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
});

const List = mongoose.model("List", listSchema);

module.exports = List;
