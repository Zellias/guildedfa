const express = require('express')
const router = express.Router()
const userData = require('../../models/user')
const { stringify } = require('querystring');
const axios = require('axios')
var flash = require('connect-flash')
var passport = require('passport')
const LocalStrategy = require("passport-local");

passport.use(new LocalStrategy(userData.authenticate()));
passport.serializeUser(userData.serializeUser());
passport.deserializeUser(userData.deserializeUser());
router.get('/', function (req, res) {
    if (req.user) return res.redirect('/')
    res.render('login/register')
  });
  

  router.post('/', async function (req, res) {
    let data = req.body;
    const secretKey = '6LfwVwIfAAAAAOtoCtvLpGA5PSkR3DymYTvMuFr8';
  
    // Verify URL
    const query = stringify({
      secret: secretKey,
      response: data['g-recaptcha-response']
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
  
    // Make a request to verifyURL
    const body = await axios.post(verifyURL)
  
  
  
    // If successful
  
  
    const userd = await userData.findOne({ 'email': data.email })
    if (userd) {
      return res.status(204).send();
    }
    if (data.password.length <= 8) {
      return res.status(204).send();
    }
    if (data.password2.length <= 8) {
      return res.status(204).send();
    }
    if (data.password != data.password2) {
      return res.status(204).send();
    }
    const userdd = await userData.findOne({ 'username': data.username })
    if (userdd) {
      return res.status(204).send();
    }
    if (!body.data.success) {
      return res.status(204).send();
    }
  
  
    userData.register(new userData({ email: data.email, username: data.username, bio: null, avatar: null, isVerified: false }), req.body.password, function (err, user) {
      if (err) {
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    });
  })

  router.get('/posts/edit/:id', isLoggedIn, async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('post/edit', { user: req.user, article: article })
  })
  router.get('/posts/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/')
    res.render('post/show', { user: req.user, article: article })
  })
  
  

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }
module.exports = router
