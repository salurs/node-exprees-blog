const mongoose = require('mongoose');
const Validator = require('fastest-validator');
const Schema = mongoose.Schema;

const v = new Validator();

const UserSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:60
    },
    surname:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:60
    },    
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlenght:3,
        maxlenght:60
    },    
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        email: true,
        minlenght:3,
        maxlenght:100
    },    
    password:{
        type: String,
        required: true,
        trim: true,
        password: true,
        minlenght:8,
        maxlenght: 50
    },    
    role:{
        type: String,
        required: true,
        trim: true,
    },    
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    }

});

const schema = {
    name:{type:'string', empty: false,max:99},
    surname:{type:"string", empty: false,max:99},
    username:{type:"string", empty: false,max:99},
    email:{type:"email",empty:false},
    role:{type:'string',empty:false},
    
};
UserSchema.methods.fastestValidatorStore = async (user)=>{
    schema.password = {type:"string",min:8};
    schema.confirmPassword = { type: "equal", field: "password" };
    const check = v.compile(schema);
    return check(user);
};
UserSchema.statics.fastestValidatorUpdate = async (user)=>{
    if(user.password != ''){
        schema.password = {type:"string",min:8};
        schema.confirmPassword = { type: "equal", field: "password" };
    }else{
        delete schema.password;
        delete schema.confirmPassword; 
    }
    const check = v.compile(schema);
    return check(user);
};



const User = mongoose.model('User', UserSchema);
module.exports = User;