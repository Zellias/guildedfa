const express = require('express')
const router = express.Router()
const multer = require('multer')
const userData = require('../../models/user')
var flash = require('connect-flash')
var storage1 = multer.diskStorage(
  {
    destination: '../../public/images/users/avatars/',
    filename: function (req, file, cb) {
      //req.body is empty...
      //How could I get the new_file_name property sent from client here?
      cb(null, req.user.id + ".png");
    }
  }
);

var avatarUpload = multer({ storage: storage1 });
const fs = require('fs')
router.get('/:username',isLoggedIn, async function (req, res) {
  let eUser = req.params.username;
  let notif = req.flash('notif')
  let isHavePfp = false;

  if (req.user) {
    let lUser = req.user.username;
    if (eUser == lUser) {
      if (fs.existsSync(`../../public/images/users/avatars/${req.user.id}.png`)) {
        isHavePfp = true
      } else {
        isHavePfp = false
      }
      res.render('dash/dashboard', { user: req.user, notif, isHavePfp })
    } else {
      const user = await userData.findOne({ 'username': eUser })
      if (fs.existsSync(`../../public/images/users/avatars/${user.id}.png`)) {
        isHavePfp = true
      } else {
        isHavePfp = false
      }
      res.render('dash/users', { user: req.user, notif })
    }
  } else {
    const user = await userData.findOne({ 'username': eUser })
    if (fs.existsSync(`../../public/images/users/avatars/${user.id}.png`)) {
      isHavePfp = true
    } else {
      isHavePfp = false
    }
    res.render('dash/users', { user: user, notif })
  }





});

router.post('/:username', avatarUpload.single('avUoload'), async (req, res) => {
    let userBio = await userData.findOne({ 'username': req.params.username })
    if (req.user) {
      if (req.user.username != req.params.username) {
        return;
      } else {
        userBio.bio = req.body.aboutme
        await userBio.save().then(e => {
          console.log(userBio)
          req.flash('notif', 'تنظیمات کاربری شما بروز شد !');
          res.redirect(`/users/${req.params.username}`)
          req.flash('notif', '');
        })
  
      }
    }
  
  
  
  })

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }
module.exports = router