const Setting = require('../models/settingModel');

const getSettings = async (req,res,next)=>{
    const settings = await Setting.findOne();
    res.render('index',{settings});
};



module.exports = {
    getSettings,
};