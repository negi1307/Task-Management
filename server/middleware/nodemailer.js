const nodemailer = require('nodemailer');

async function emailSender(user) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'support@rowthtech.com',
            pass: 'jzkaxixunjohaita'

        }
    });

    const details = {
        from: 'support@rowthtech.com',
        to: user.email,
        subject: 'Testing mail',
        text: 'This mail is here to certify that our code is working',
        html: `Dear ${user.userName}
              Here Your login credentials
              Email: ${user.email}
              Password: ${user.plainPassword}`
    };

    try {
        const info = await transporter.sendMail(details);
        console.log('Email sent Successfully', info.response);
        return info.response;
    } catch (error) {
        console.error('Error in sending mail', error);
        throw error;
    }
}


module.exports = { emailSender };