const Contact = require('../models/contactModel');
const dateFormat = require('dateformat');
const createError = require('http-errors');

const lastContacts = async (req, res, next)=>{
    try {
        const contacts = await Contact.find().sort({_id:-1}).limit(3);
        const unRead = await Contact.count({isRead:false});
        contacts.forEach(async (el)=>{
            el.newDate = dateFormat(el.createdAt, 'mediumDate');
       });
        req.contacts = contacts;
        req.unRead = unRead;
        next();
    } catch (error) {
        next(createError(404,error));
    }
 };
 
 module.exports = lastContacts;