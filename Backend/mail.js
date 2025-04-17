const nodemailer = require('nodemailer');

// SMTP Configuration
const transporter = nodemailer.createTransport({
    host: 'your_cpanel_mail_server', // e.g., mail.yourdomain.com
    port: 587, // or 465 for secure
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'your_email@yourdomain.com', // your email address
        pass: 'your_email_password', // your email password
    },
});

module.exports = transporter;
