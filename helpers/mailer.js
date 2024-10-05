const nodemailer = require('nodemailer');
const config = require('../configs');

const send = async (subject, receiver, otp) => {
    try {
        const auth = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            port: 465,
            auth: {
                user: config.nodemailer.sender,
                pass: config.nodemailer.appPassword,
            },
        });

        const receiverObj = {
            from: config.nodemailer.sender,
            to: receiver,
            subject,
            text: `your otp is ${otp} \n 🕕 this code is valid for next 60 seconds. 🕕 \n 🙏🏻 THANK YOU 🙏🏻`,
        };

        await auth.sendMail(receiverObj);
        return;
    } catch (e) {
        console.log(e.message);
    }
};

module.exports = {
    send,
};
