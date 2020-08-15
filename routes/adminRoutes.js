const router = require('express').Router();
const multer  = require('multer');
const defaultController = require('../controllers/admin/defaultController');
const authMiddleware = require('../middleware/authMiddleware');
const contactMiddleware = require('../middleware/contactMiddleware');
const settingController = require('../controllers/admin/settingController');
const blogController = require('../controllers/admin/blogController');
const userController = require('../controllers/admin/userController');
const contactController = require('../controllers/admin/contactController');

const DIR = './public/uploads/';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR)
    },
    filename: function (req, file, cb) {
        const extension = (file.originalname).split('.');
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueName + '.' + extension[1])
    },
   
  });
  const upload = multer({ storage: storage });
// const upload = multer({ dest: './public/uploads/' });
// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//       if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//         cb(null, true);
//       } else {
//         cb(null, false);
//         return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//       }
//     }
//   });


//general
router.get('/',defaultController.login);
router.post('/',defaultController.authentication);
router.delete('/',authMiddleware,defaultController.logout);
router.get('/userseed',defaultController.seed);
router.get('/dashboard',[authMiddleware,contactMiddleware],defaultController.dashboard);
//settings
router.get('/settings',[authMiddleware,contactMiddleware], settingController.index);
router.get('/settings/seed',[authMiddleware,contactMiddleware], settingController.seed);
router.put('/settings/:id',[authMiddleware,contactMiddleware,upload.single('logo')], settingController.update);
router.get('/settings/:id/edit',[authMiddleware,contactMiddleware], settingController.edit);
//blogs
router.get('/blogs',[authMiddleware,contactMiddleware], blogController.index);
router.post('/blogs',[authMiddleware,contactMiddleware,upload.single('image')], blogController.store);
router.get('/blogs/create',[authMiddleware,contactMiddleware], blogController.create);
router.get('/blogs/:id',[authMiddleware,contactMiddleware], blogController.show);
router.put('/blogs/:id',[authMiddleware,contactMiddleware,upload.single('image')], blogController.update);
router.delete('/blogs/:id',[authMiddleware,contactMiddleware], blogController.remove);
router.get('/blogs/:id/edit',[authMiddleware,contactMiddleware], blogController.edit);
//users
router.get('/users',[authMiddleware,contactMiddleware], userController.index);
router.post('/users',[authMiddleware,contactMiddleware], userController.store);
router.get('/users/create',[authMiddleware,contactMiddleware], userController.create);
router.get('/users/:id',[authMiddleware,contactMiddleware], userController.show);
router.put('/users/:id',[authMiddleware,contactMiddleware], userController.update);
router.delete('/users/:id',[authMiddleware,contactMiddleware], userController.remove);
router.get('/users/:id/edit',[authMiddleware,contactMiddleware], userController.edit);
//contacts
router.get('/contacts',[authMiddleware,contactMiddleware], contactController.index);
router.get('/contacts/:id',[authMiddleware,contactMiddleware], contactController.show);
router.delete('/contacts/:id',[authMiddleware,contactMiddleware], contactController.remove);


module.exports = router;