const express = require('express')
const router = express.Router()
const multer = require('multer')
const userData = require('../../models/user')

var flash = require('connect-flash')





router.get("/", isLoggedIn, function (req, res) {
    res.render('dash/settings', { user: req.user });
  });
  
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }



  module.exports = router