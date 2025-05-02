const mongoose = require("mongoose");
const initdata = require('./data.js');
const List = require('../models/listing.js');

main().then((result)=>{
        console.log("connection established...");
    }).catch((error)=>{
        console.log("connection failed..");
    })

    async function main(){
        await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
    }


const initDB = async()=>{
    await List.deleteMany({});
    await List.insertMany(initdata.data);
    console.log("data was initialized..")
};

initDB();
