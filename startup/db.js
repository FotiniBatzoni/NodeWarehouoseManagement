const mongoose = require("mongoose");

//to connect with Database
module.exports = function(){
    mongoose.
    connect(process.env.mongooseURI)
    .then(()=> console.log("Connected to DB"));
}