var cookieParser = require('cookie-parser');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose')
var passport = require('passport')
var flash = require('connect-flash')
const methodOverride = require('method-override')
const LocalStrategy = require("passport-local");
mongoose.Promise = global.Promise
mongoose.connect('XD').then(connected => {
  console.log('database connected')
}).catch(err => {
  console.log('cant connect to the database')
});
const userData = require('./models/user')
app.use(require("express-session")({
  secret: "Miss white is my cat",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(userData.authenticate()));
passport.serializeUser(userData.serializeUser());
passport.deserializeUser(userData.deserializeUser());
app.use(flash())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'))
app.use(bodyparser.json());
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs');
const mainRoute = require('./router/main/main')
app.use('/',mainRoute)

const regRoute = require('./router/sign/register')
app.use('/register',regRoute)

const logRoute = require('./router/sign/login')
app.use('/login',logRoute)

const userRoute = require('./router/user/users')
app.use('/users',userRoute)

const postRoute = require('./router/posts/posts')
app.use('/posts',postRoute)

const apiRoute = require('./router/rest/api')
app.use('/api',apiRoute)

const settingsRoute = require('./router/user/settings')
app.use('/settings',settingsRoute)

const mailVerify = require('./router/mail/verify')
app.use('/verify',mailVerify)



app.listen(3000 ,()=> {
  console.log('Server Started !')
})
