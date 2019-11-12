// SOURCE: https://github.com/lang-ai/react-emails/blob/master/server/createEmail.js

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import Path from 'path';

import resetPasswordEmail from './layout';

const STYLE_TAG = '%STYLE%';
const CONTENT_TAG = '%CONTENT%';

function getFile(relativePath) {
    return new Promise((resolve, reject) => {
        const path = Path.join(__dirname, relativePath);
        return fs.readFile(path, { encoding: 'utf8' }, (err, file) => {
            if (err) return reject(err);
            return resolve(file);
        });
    });
}

function createEmail(data, htmlFile, cssFile) {
    return new Promise((resolve, reject) => {
        Promise.all([
            getFile(cssFile),
            getFile(htmlFile),
        ]).then(([style, template]) => {
            const emailElement = React.createElement(resetPasswordEmail, data);
            const content = ReactDOMServer.renderToStaticMarkup(emailElement);

            let emailHTML = template;
            emailHTML = emailHTML.replace(CONTENT_TAG, content);
            emailHTML = emailHTML.replace(STYLE_TAG, style);

            console.log(emailHTML);
            resolve(emailHTML);
        });
    });

    // return Promise.all([
    //     getFile('./resetPasswordEmail.scss'),
    //     getFile('./resetPasswordEmail.html'),
    // ]).then(([style, template]) => {
    //     // Check imports in GitHub
    //     const emailElement = React.createElement(resetPasswordEmail, { data });
    //     const content = ReactDOMServer.renderToStaticMarkup(emailElement);

    //     let emailHTML = template;
    //     emailHTML = emailHTML.replace(CONTENT_TAG, content);
    //     emailHTML = emailHTML.replace(STYLE_TAG, style);

    //     console.log(emailHTML);
    //     return emailHTML;
    // });
}

export default createEmail;
