
const nodemailer = require('nodemailer');
 
function send(email,verifyCode) {
    
    let mailTransporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: 'rangani778@outlook.com',
            pass: 'hoseiner1234'
        }
    });
    
    let mailDetails = {
    from: 'rangani778@outlook.com',
    to: email,
    subject: 'Verify in GuildedFa',
    text: 'Click This Link -> http://localhost:3000/verify/'+verifyCode
    
};

mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log('Error Occurs'+err);
    } else {
        console.log('Email sent successfully');
    }
});

}
module.exports = {send}