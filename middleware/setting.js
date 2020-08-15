const Setting = require('../models/settingModel');

const settings = async (req, res, next)=>{
    try {
        let newSettings = [];
        const settings = await Setting.find({});
        if(!settings)
            throw new Error;
        settings.forEach((setting)=>{
            newSettings[setting['key']] = setting.value;
        });
        req.settings = newSettings;
        next();
    } catch (err) {
        next(new Error);
    }
};

module.exports = settings;