import dotenv from 'dotenv';
import { transporter } from '../server';

dotenv.config({ silent: true });

export function sendEmail(to, subject, html) {
    transporter.sendMail({
        from: process.env.GMAIL_ADDR,
        to,
        subject,
        html,
    }, (err, info) => {

    });
}
