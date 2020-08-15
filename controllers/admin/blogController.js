const fs = require('fs');
const Blog = require('../../models/blogModel');
const createError = require('http-errors');


const index = async (req,res,next)=>{
    try {
        const blogs = await Blog.find().sort({_id:-1});
        const status = req.flash('status');
        res.render('admin/blogs/index',{
            blogs,
            status,
            lastContacts: req.contacts,
            unRead: req.unRead
        });        
    } catch (error) {
        next(createError(404,error));
    }
};

const create = (req,res,next)=>{
    try{
        res.render('admin/blogs/create',{
            validator: {
                title: req.flash('vtitle'),
                subtitle: req.flash('vsubtitle'),
                body: req.flash('vbody'),
                author: req.flash('vauthor'),
                description: req.flash('vdescription'),
                keywords: req.flash('vkeywords'),
                image: req.flash('vimage')
            },
            old:{
                title: req.flash('title'),
                subtitle: req.flash('subtitle'),
                body: req.flash('body'),
                author: req.flash('author'),
                description: req.flash('description'),
                keywords: req.flash('keywords')
            },
            lastContacts: req.contacts,
            unRead: req.unRead
        });
    }catch(error){
        next(createError(404,error));
    }
};

const show = async (req,res,next)=>{
    try{
        const blog = await Blog.findById({_id:req.params.id});
        res.render('admin/blogs/show',{
            blog,
            lastContacts: req.contacts,
            unRead: req.unRead
        });
    }catch(error){
        next(createError(404,error));
    }
};


const edit = async (req,res,next)=>{
    try{
        const blog = await Blog.findById({_id:req.params.id});
        res.render('admin/blogs/edit',{
            blog,
            validator: {
                title: req.flash('vtitle'),
                subtitle: req.flash('vsubtitle'),
                body: req.flash('vbody'),
                author: req.flash('vauthor'),
                description: req.flash('vdescription'),
                keywords: req.flash('vkeywords'),
                image: req.flash('vimage')
            },
            lastContacts: req.contacts,
            unRead: req.unRead
        });
    }catch(error){
        next(createError(404,error));
    }
};

const store = async (req,res,next)=>{
    try {
        req.body.image = '';
        if(req.file !== undefined){
            req.body.image = req.file.filename;
        }
        
        const blog = new Blog(req.body);
        const check = await blog.fastestValidatorStore(req.body);
        if (check === true) {
            const result = await blog.save();
            if(result){
                req.flash('status', 'success');
                res.redirect('/admin/blogs');
            }
        }else{
            if(req.file)
                fs.unlinkSync(req.file.path);
            check.forEach(el => {
                req.flash('v'+el.field, el.message);
            });
            req.flash('title', req.body.title);
            req.flash('subtitle', req.body.subtitle);
            req.flash('body', req.body.body);
            req.flash('author', req.body.author);
            req.flash('description', req.body.description);
            req.flash('keywords', req.body.keywords);
            res.redirect('/admin/blogs/create');
        }
    } catch (error) {
        next(createError(404,error));
    }
};

const update = async (req,res,next)=>{
    try {
        req.body.image = '';
        if(req.file !== undefined){
            req.body.image = req.file.filename;
        }
        const check = await Blog.fastestValidatorUpdate(req.body);
        if(check === true){
            const blog = await Blog.findByIdAndUpdate({_id:req.params.id},req.body,{new:false,runValidators:false,useFindAndModify:false});
            const result = await blog.save();
            if(result){
                if(req.file){
                    if(fs.existsSync(`./public/uploads/${blog.image}`))//check if file 
                        fs.unlinkSync(`./public/uploads/${blog.image}`);//remove file
                }
                req.flash('status', 'success');
                res.redirect('/admin/blogs');
            }else{
                res.status(400).json({status:'error'});
            }
        }else{
            if(req.file)
                fs.unlinkSync(req.file.path);
            check.forEach(el => {
                req.flash('v'+el.field, el.message);
            });
            res.redirect('/admin/blogs/'+req.params.id+'/edit');
        }
        
    } catch (error) {
        next(createError(404,error));
    }
    
};

const remove = async (req,res,next)=>{
    try {
        const blog = await Blog.findByIdAndRemove({_id:req.params.id},{useFindAndModify:false});
        if(blog){
            if(fs.existsSync(`./public/uploads/${blog.image}`))//check if file 
                fs.unlinkSync(`./public/uploads/${blog.image}`);//remove file
            res.status(200).json({status:'success'});
        }else{
            res.status(400).json({status:'error'});
        }
        
    } catch (error) {
        next(createError(404,error));
    }
};

module.exports = {
    index,
    create,
    show,
    edit,
    store,
    update,
    remove
};