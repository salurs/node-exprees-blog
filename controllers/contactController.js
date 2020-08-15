const Contact = require('../models/contactModel');
const createError = require('http-errors');

const index = async (req,res,next)=>{
    res.render('contact',{
        settings:req.settings,
        SITE_KEY:process.env.SITE_KEY,
        status:req.flash('status'),
        validator:{
            name: req.flash('vname'),
            email: req.flash('vemail'),
            phone: req.flash('vphone'),
            message: req.flash('vmessage')
        },
        old:{
            name:req.flash('name'),
            email:req.flash('email'),
            phone:req.flash('phone'),
            message:req.flash('message')
        }
    });
};
const store = async (req,res,next)=>{
    try {
        const contact = new Contact(req.body);
        const check = await contact.fastestValidatorStore(req.body);
        if(check === true){
            const result = await contact.save(req.body);
            if(result){
                req.flash('status', 'Successfully');
                res.redirect('/contact');
            }   
        }else{
            console.log(check)
            check.forEach(el => {
                req.flash('v'+el.field, el.message);
            });
            req.flash('name', req.body.name);
            req.flash('email', req.body.email);
            req.flash('phone', req.body.phone);
            req.flash('message', req.body.message);
            res.redirect('/contact');
        }
    } catch (error) {
        next(createError(404,error));
    }
};



module.exports = {
    index,
    store
};