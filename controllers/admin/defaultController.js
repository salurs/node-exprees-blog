const mongoose = require('mongoose');
const User = require('../../models/userModel');
const createAdmin = require('../../db/userSeeder').createAdmin();
const bcrypt = require('bcrypt');
const createError = require('http-errors');

const login = async (req, res, next)=>{
    try{
        res.render('admin/default/login',{
            old:{
                email: req.flash('email')
            },
            validation:{
                message: req.flash('message')
            }
        });
    }catch(error){
        next(createError(404,error));
    }
};
const authentication = async (req, res, next)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        if (email && password) {
            const user = await User.findOne({email:email});
            if (user) {
                const match = await bcrypt.compare(password, user.password);
                if(match){
                    req.session.loggedin = true;
                    req.session.email = user.email;
                    req.session.username = user.username;
                    res.redirect('/admin/dashboard');
                }else{
                    req.flash('email', email);
                    req.flash('message', 'Incorrect Email and/or Password!');
                    res.redirect('/admin');
                }
            } else {
                req.flash('email', email);
                req.flash('message', 'Incorrect Email and/or Password!');
                res.redirect('/admin');
            }
        } else {
            req.flash('email', email);
            req.flash('message', 'Please enter Email and Password!');
            res.redirect('/admin');
            
        }
    }catch(error){
        next(createError(404,error));
    }
};
const logout = async (req, res, next)=>{
    try {
        req.session.loggedin = false;
        req.session.email = null;
        req.session.username = null;
        res.redirect('/admin');
   } catch (error) {
        next(createError(404,error));
   }
};
const seed = async (req, res, next)=>{
    const admin = await createAdmin;
    //remove collection before seeding
    mongoose.connection.db.dropCollection('users', function(err, result) {});
    let event = new User(admin);
    event.save();
    res.redirect('/admin');
};
const dashboard = async (req,res,next)=>{
    res.render('admin/default/dashboard',{
        lastContacts: req.contacts,
        unRead: req.unRead
    });
};


module.exports = {
    login,
    authentication,
    logout,
    seed,
    dashboard
};