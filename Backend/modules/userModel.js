const mongoose = require('mongoose');

// create Schema for users 

const userSchem = mongoose.Schema({
    name:{
        type:String,
        required:[true]
    },
    email:{
        type:String,
        required:[true]
    },
    password:{
        type:String,
        required:[true]
    }
},{timestamps:true})

// create Model for user 

const userModel = mongoose.model("users",userSchem);

module.exports = userModel;