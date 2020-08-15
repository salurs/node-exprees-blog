const express = require('express');
const path = require('path');
const cors = require("cors");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const homeRoutes = require('./routes/homeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const methodOverride = require('method-override');
const dbConnection = require('./db/dbConnection');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 8000;


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
const corsOptions = { origin: `http://localhost:${port}` };
app.use(cors(corsOptions));

app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
	resave: true,
	saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}));
app.use(flash());
//db connection
dbConnection();

//static files
app.use(express.static(path.join(__dirname,'public')));
// app.use('/css', express.static(__dirname+'public/css'));
// app.use('/js', express.static(__dirname+'public/js'));
// app.use('/vendor', express.static(__dirname+'public/vendor'));
// app.use('/img', express.static(__dirname+'public/img'));

//set views
app.set('views','./views');
app.set('view engine','ejs');

app.use('/', homeRoutes);
app.use('/admin', adminRoutes);
app.use(errorMiddleware);




app.listen(port, () => console.log(`Listening on port ${port}`));