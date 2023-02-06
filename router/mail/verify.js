const express = require('express')
const router = express.Router()
const multer = require('multer')
const userData = require('../../models/user')
const mail = require('../../f/mail')
var flash = require('connect-flash')

let vID;

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


router.get("/",isLoggedIn,async function (req, res) {
    if(req.user.isVerified){
        res.redirect('/');
    }else{

        res.render('mail/verify', { user: req.user });
    }
});

router.post("/",isLoggedIn,async function (req, res) {

    let data = req.body
    if(data.on === 'true'){
    
        vID = makeid(32)
        mail.send(req.user.email,vID)
        console.log(vID)
    }else{
        res.redirect('./verify')
    }
}); 

router.get("/:vID",isLoggedIn, async function (req, res) {
if(req.user.isVerified){
    res.redirect('/')
}else{
    if(req.params.vID === vID){
        const user = await userData.findOne({'username':req.user.username})
        user.isVerified = true;
        await user.save()
        res.render('mail/verified')
   }else{
    res.redirect('./verify')
   }
}
   
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}



module.exports = router 