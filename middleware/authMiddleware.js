const auth = async (req, res, next)=>{
   try {
        if(req.session.loggedin){
            res.locals.user ={
                username: req.session.username,
                email: req.session.email
            };
            next();
        }else{
            res.redirect('/admin');
        }
        
   } catch (error) {
       next(error)
   }
};

module.exports = auth;