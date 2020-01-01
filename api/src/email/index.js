import dotenv from 'dotenv';
// import { transporter } from '../server';
// const sgMail = require('@sendgrid/mail');
import sgMail from '@sendgrid/mail';

dotenv.config({ silent: true });

/**
 * Sends an email to the specified address with specified parameters
 * @param {*} to
 * @param {*} subject
 * @param {*} html
 */
// Nodemailer + Gmail
// export function sendEmail(to, subject, html) {
//     // console.log(`sending email to '${to}' with subject '${subject}' and html '${html}'`);
//     return new Promise((resolve, reject) => {
//         transporter.sendMail({
//             from: process.env.GMAIL_ADDR,
//             to,
//             subject,
//             html,
//         }, (err, info) => {
//             if (err) {
//                 console.log('email sending error');
//                 reject(err);
//             } else {
//                 console.log('no error sending email');
//                 resolve(info);
//             }
//         });
//     });
// }

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

export function sendEmail(to, subject, html) {
    return new Promise((resolve, reject) => {
        const msg = {
            to,
            from: 'dplanner.official@gmail.com',
            subject,
            html,
        }; // Can include 'text' field too
        sgMail.send(msg).then(() => {
            resolve();
        }).catch((error) => {
            console.error(error);
            reject();
        });
    });
}
