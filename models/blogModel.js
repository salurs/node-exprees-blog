const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Validator = require('fastest-validator');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const v = new Validator({
    messages:{
        stringEmpty: 'Cannot be empty! ',
        stringMax: 'Max. {expected} characters',
        stringMin: 'Min. {expected} characters',
    }
});

const BlogSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        minlenght:3,
        maxlenght:255
    },
    slug:{
        type: String,
        unique: true,
        slug: "title"
    },
    subtitle:{
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
    body:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    author:{
        type: String,
        trim: true,
        maxlength:255
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
    title:      {type:'string', empty:false, min:5},
    subtitle:   {type:"string", empty:false, min:5},
    body:       {type:"string", empty:false, min:5},
    author:     {type:'string', empty:false, min:5},
    keywords:   {type:'string', empty:false, min:5},
    description:{type:'string', empty:false, min:5}
    
};
BlogSchema.methods.fastestValidatorStore = async (blog)=>{
    schema.image = {type:"string", empty:false};
    const check = v.compile(schema);
    return check(blog);
};
BlogSchema.statics.fastestValidatorUpdate = async (blog)=>{
    if(blog.image == '')
        delete blog.image;
    else
        schema.image = {type:"string", empty:false};
    const check = v.compile(schema);
    return check(blog);
};

const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;