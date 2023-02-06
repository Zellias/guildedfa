const express = require('express')
const router = express.Router()
const Article = require('../../models/article')
var flash = require('connect-flash')
router.get('/', async function (req, res) {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('index', { user: req.user, articles: articles });
});


module.exports = router