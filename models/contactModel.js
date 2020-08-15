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

const ContactSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:100
    },
    email:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:100
    },
    phone:{
        type: String,
        required: true,
        trim: true,
        maxlenght:20
    },
    message:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:1000
    },
    isRead:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

const schema = {
    name:{type:'string', empty:false, min:5},
    email:{type:"string", empty:false, min:5},
    phone:{type:"string", empty:false, min:5},
    message:{type:'string', empty:false, min:5}
};
ContactSchema.methods.fastestValidatorStore = async (contact)=>{
    const check = v.compile(schema);
    return check(contact);
};

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;