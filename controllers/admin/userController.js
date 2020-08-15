const fs = require('fs');
const bcrypt = require('bcrypt');
const User = require('../../models/userModel');
const createError = require('http-errors');



const index = async (req,res,next)=>{
    try{
        const users = await User.find().sort({_id:-1});
        const status = req.flash('status');
        res.render('admin/users/index',{
            users,
            status,
            lastContacts: req.contacts,
            unRead: req.unRead
        });
    }catch(error){
        next(createError(404,error));
    }
};

const create = (req,res,next)=>{
    try{
        res.render('admin/users/create',{
            validator: {
                name: req.flash('vname'),
                surname: req.flash('vsurname'),
                username: req.flash('vusername'),
                email: req.flash('vemail'),
                password: req.flash('vpassword'),
                confirmPassword: req.flash('vconfirmPassword'),
                role: req.flash('vrole'),
            },
            old:{
                name: req.flash('name'),
                surname: req.flash('surname'),
                username: req.flash('username'),
                mail: req.flash('mail'),
                role: req.flash('role'),
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
        const user = await User.findById({_id:req.params.id});
        res.render('admin/users/show',{
            user,
            lastContacts: req.contacts,
            unRead: req.unRead
        });
    }catch(error){
        next(createError(404,error));
    }
};


const edit = async (req,res,next)=>{
    try{
        const user = await User.findById({_id:req.params.id});
        res.render('admin/users/edit',{
            user,
            validator: {
                name: req.flash('vname'),
                surname: req.flash('vsurname'),
                username: req.flash('vusername'),
                email: req.flash('vemail'),
                password: req.flash('vpassword'),
                confirmPassword: req.flash('vconfirmPassword'),
                role: req.flash('vrole'),
            },
            lastContacts: req.contacts,
            unRead: req.unRead
        });
    }catch(error){
        next(createError(404,error));
    }
};

const store = async (req,res,next)=>{
    try{
        const user = new User(req.body);
        const check = await user.fastestValidatorStore(req.body);
        if(check === true){
            user.password = await bcrypt.hash(req.body.password, 10);
            const result = await user.save(req.body);
            if(result){
                req.flash('status', 'success');
                res.redirect('/admin/users');
            }   
        }else{
            console.log(check)
            check.forEach(el => {
                req.flash('v'+el.field, el.message);
            });
            req.flash('name', req.body.name);
            req.flash('surname', req.body.surname);
            req.flash('username', req.body.username);
            req.flash('mail', req.body.email);
            req.flash('role', req.body.role);
            res.redirect('/admin/users/create');
        }
    }catch(error){
        next(createError(404,error));
    }
};

const update = async (req,res,next)=>{
    try {
        delete req.body.createdAt;
        const check = await User.fastestValidatorUpdate(req.body);
        if(check === true){
            if(req.body.password == '')
                delete req.body.password
            else
                req.body.password = await bcrypt.hash(req.body.password, 10);
            req.body.updatedAt = Date.now();
            const user = await User.findByIdAndUpdate({_id:req.params.id},req.body,{new:false,runValidators:true,useFindAndModify:true});
            const result = await user.save();
            if(result){
                req.flash('status', 'success');
                res.redirect('/admin/users');
            }   
        }else{
            check.forEach(el => {
                req.flash('v'+el.field, el.message);
            });
            res.redirect('/admin/users/'+req.params.id+'/edit');
        } 
    } catch (error) {
        next(createError(400,error));
    }
};

const remove = async (req,res,next)=>{
    try {
        const user = await User.findByIdAndRemove({_id:req.params.id},{useFindAndModify:false});
        if(user){
            res.status(200).json({status:'success'});
        }else{
            res.status(400).json({status:'error'});
        }
        
    } catch (error) {
        next(error)
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