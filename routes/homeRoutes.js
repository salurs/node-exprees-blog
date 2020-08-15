const router = require('express').Router();
const blogController = require('../controllers/blogController');
const contactController = require('../controllers/contactController');
const settingMiddleware = require('../middleware/setting');
const dotenv = require('dotenv').config();
const Recaptcha = require('express-recaptcha').RecaptchaV3;
const recaptcha = new Recaptcha(process.env.SITE_KEY, process.env.SECRET_KEY,{callback:'cb'});



router.get('/',settingMiddleware, blogController.getBlogs);
router.get('/blog/:slug', settingMiddleware, blogController.getBlog);
router.get('/blogs/:page', settingMiddleware, blogController.paginateBlogs);

router.get('/about', settingMiddleware, (req,res)=>{
   res.render('about',{settings:req.settings});
});
router.get('/contact',[settingMiddleware, recaptcha.middleware.render], contactController.index);
router.post('/contact',recaptcha.middleware.verify, contactController.store);
module.exports = router;