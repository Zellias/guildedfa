const express = require('express')
const router = express.Router()
var flash = require('connect-flash')
var passport = require('passport')
const LocalStrategy = require("passport-local");
const userData = require('../../models/user')
passport.use(new LocalStrategy(userData.authenticate()));
passport.serializeUser(userData.serializeUser());
passport.deserializeUser(userData.deserializeUser());

router.get('/', function (req, res) {
    if (req.user) return res.redirect('/')
    const failureFlash = req.flash('failureFlash');
    console.log(failureFlash)
    res.render('login/login', { failureFlash });
  });


  router.post('/', passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login",failureFlash:{type: "failureFlash", message: "یوزر نیم یا پسورد اشتباه است! لطفا مجدد تلاش کنید"} }), async function (req, res) {
    console.log(req.body)
    req.flash('notifLogin', 'یوزر نیم یا پسورد اشتباه است! لطفا مجدد تلاش کنید')
  });
  
  router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });
  
  

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }
module.exports = router
