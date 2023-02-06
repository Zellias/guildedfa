const express = require('express')
const router = express.Router()
const multer = require('multer')
const userData = require('../../models/user')
const Article = require('../../models/article')
var flash = require('connect-flash')

router.get('/v1/info/user/:username', async function (req, res) {
    let userBio = await userData.findOne({ 'username': req.params.username })
    console.log(userBio)
    let json = {
      username: userBio.username,
      bio: userBio.bio,
      avatar: userBio.avatar,
      posts: userBio.posts,
      badges: userBio.badges,
  
    }
    res.json(json);
  });
  
  
  router.get('/v1/isused/email/:email', async function (req, res) {
    let email = req.params.email
    const userd = await userData.findOne({ 'email': email })
  
    if (userd) {
      res.json({ 'isUsed': true })
  
    } else {
      res.json({ 'isUsed': false })
    }
  })
  router.get('/v1/isused/username/:username', async function (req, res) {
    let username = req.params.username
    const userd = await userData.findOne({ 'username': username })
  
    if (userd) {
      res.json({ 'isUsed': true })
  
    } else {
      res.json({ 'isUsed': false })
    }
  })


module.exports = router