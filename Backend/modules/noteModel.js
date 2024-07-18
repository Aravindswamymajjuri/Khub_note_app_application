const mongoose = require('mongoose');


// create Schema for note 


const noteSchema = mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }

},{timestamps:true})


// create Model for note 

const noteModel = mongoose.model("notecollections",noteSchema);

module.exports = noteModel;