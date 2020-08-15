const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Validator = require('fastest-validator');
const v = new Validator({
    messages:{
        stringEmpty: 'Cannot be empty! ',
        stringMax: 'Max. {expected} characters',
        stringMin: 'Min. {expected} characters',
    }
});


const SettingSchema = new Schema({
    key:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:50
    },
    value:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:255
    },
    type:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:20
    }
});
const schema = {
    value:  {type:"string", empty:false}
    
};
SettingSchema.statics.fastestValidatorUpdate = async (setting)=>{
    const check = v.compile(schema);
    return check(setting);
};


const Setting = mongoose.model('Setting', SettingSchema);
module.exports = Setting;