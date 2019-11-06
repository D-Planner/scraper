import dotenv from 'dotenv';
import { transporter } from '../server';

dotenv.config({ silent: true });

export function sendEmail(to, subject, html) {
    // console.log(`sending email to '${to}' with subject '${subject}' and html '${html}'`);
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: process.env.GMAIL_ADDR,
            to,
            subject,
            html,
        }, (err, info) => {
            if (err) {
                console.log('email sending error');
                reject(err);
            } else {
                console.log('no error sending email');
                resolve(info);
            }
        });
    });
}
