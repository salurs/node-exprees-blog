const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SettingSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:255
    },
    description:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:255
    },
    keywords:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:255
    },
    logo:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:255
    },
    twitter:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:255
    },
    facebook:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:255
    },
    github:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:255
    },
    copyright:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:255
    },

});


const Setting = mongoose.model('Setting', SettingSchema);
module.exports = Setting;