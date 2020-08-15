const mongoose = require('mongoose');
const Setting = require('../../models/settingModel');
const settingsSeeder = require('../../db/settingSeeder').settings;
const createError = require('http-errors');


const index = async (req,res,next)=>{
    const settings = await Setting.find();
    res.render('admin/settings/index',{
        settings,
        lastContacts: req.contacts,
        unRead: req.unRead
    });
};

const seed = async (req,res,next)=>{
   try {
        //remove collection before seeding
        mongoose.connection.db.dropCollection('settings', function(err, result) {});
        settingsSeeder.forEach(el => {
            let event = new Setting(el);
            event.save();
        });
        res.redirect('/admin/settings');
   } catch (error) {
       next(createError(404,error));
   }
};

const edit = async (req,res,next)=>{
    try {
        const setting = await Setting.findById({_id:req.params.id});
        res.render('admin/settings/edit',{
            setting,
            validator:{
                value: req.flash('vvalue')
            },
            lastContacts: req.contacts,
            unRead: req.unRead
        });
    } catch (error) {
        next(createError(404,error))
    }
};

const update = async (req,res,next)=>{
    try {
        const check = await Setting.fastestValidatorUpdate(req.body);
        if(check === true){
            const setting = await Setting.findByIdAndUpdate({_id:req.params.id},req.body,{new:false,runValidators:false,useFindAndModify:false});
            const result = await setting.save();
            if(result){
                req.flash('status', 'success');
                res.redirect('/admin/settings');
            }else{
                //res.status(400).json({status:'error'});
                next(createError(402,'Cannot Save!'))
            }
        }else{
            req.flash('vvalue', check[0].message);
            res.redirect('/admin/settings/'+req.params.id+'/edit');
        }
        
    } catch (error) {
        next(createError(404, error))
    }
    
};


module.exports = {
    seed,
    index,
    edit,
    update,
};