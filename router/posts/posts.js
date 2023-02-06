const express = require('express')
const router = express.Router()
const multer = require('multer')
const userData = require('../../models/user')
const Article = require('../../models/article')
var flash = require('connect-flash')
const { stringify } = require('querystring');
const axios = require('axios')
const methodOverride = require('method-override')
router.get('/', async function (req, res) {
    const articles = await Article.find().sort({ createdAt: 'desc' })


    res.render('post/posts', { user: req.user, articles: articles });
});

router.get('/add', isLoggedIn,isVerified, function (req, res) {



    res.render('post/addPost', { user: req.user, article: new Article() });
});
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/')
    res.render('post/show', { user: req.user, article: article })
})

router.post('/add', isLoggedIn,isVerified, async (req, res, next) => {
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
    if (!body.data.success) {
        return res.status(204).send();
    }
    req.article = new Article()
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    article.author = req.user.username
    article.imageURL = req.body.imageLink
    try {


        article = await article.save()
        await userData.updateOne(
            { 'username': req.user.username },
            { $push: { posts: [article.id] } }
        )
        res.redirect(`/posts/${article.slug}`)
    } catch (e) {
        console.log(e)
        res.render(`post/addPost`, { user: req.user, article: article })
    }
})
router.put('/edit/:id', isLoggedIn,isVerified, async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    article.author = req.user.username
    article.imageURL = req.body.imageLink

    try {
        article = await article.save()


        res.redirect(`/posts/${article.slug}`)
    } catch (e) {
        console.log(e)
        res.render(`posts/${article.slug}`, { user: req.user, article: article })
    }
})
router.delete('/delete/:id', isLoggedIn,isVerified, async (req, res) => {

    let art = await Article.findById(req.params.id)
    await userData.updateOne(
        { 'username': req.user.username },
        { $pull: { posts: [art.id] } }
    )
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
function isVerified(req, res, next) {
    if (req.user.isVerified) {
        return next();
    }
    res.redirect("/verify");
}
module.exports = router