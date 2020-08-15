const Contact = require('../../models/contactModel');
const createError = require('http-errors');



const index = async (req,res,next)=>{
    try{
        const contacts = await Contact.find().sort({_id:-1});
        const status = req.flash('status');
        res.render('admin/contacts/index',{
            contacts,
            status,
            lastContacts: req.contacts,
            unRead: req.unRead
        });
    }catch(error){
        next(createError(404,error));
    }
};



const show = async (req,res,next)=>{
    try{
        const contact = await Contact.findById({_id:req.params.id});
        if(!contact.isRead){
            contact.isRead = true;
            contact.save();
        }
        res.render('admin/contacts/show',{
            contact,
            lastContacts: req.contacts,
            unRead: req.unRead
        });
    }catch(error){
        next(createError(404,error));
    }
};


const remove = async (req,res,next)=>{
    try {
        const contact = await Contact.findByIdAndRemove({_id:req.params.id},{useFindAndModify:false});
        if(contact){
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
    show,
    remove
};