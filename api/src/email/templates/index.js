// SOURCE: https://github.com/lang-ai/react-emails/blob/master/server/createEmail.js

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import Path from 'path';

import resetPasswordEmail from './resetPasswordEmail/layout';
import verifyEmailEmail from './verifyEmailEmail/layout';

/**
 * Tells locations of email files based on query
 */
const emailLookup = {
    resetPasswordEmail: {
        htmlFile: './resetPasswordEmail/resetPasswordEmail.html',
        cssFile: './resetPasswordEmail/resetPasswordEmail.css',
        jsFile: resetPasswordEmail,
    },
    verifyEmailEmail: {
        htmlFile: './verifyEmailEmail/verifyEmailEmail.html',
        cssFile: './verifyEmailEmail/verifyEmailEmail.css',
        jsFile: verifyEmailEmail,
    },
};

const STYLE_TAG = '%STYLE%';
const CONTENT_TAG = '%CONTENT%';

/**
 * Gets a file based on relative location
 * @param {*} relativePath
 */
function getFile(relativePath) {
    return new Promise((resolve, reject) => {
        const path = Path.join(__dirname, relativePath);
        return fs.readFile(path, { encoding: 'utf8' }, (err, file) => {
            if (err) return reject(err);
            return resolve(file);
        });
    });
}

/**
 * Grabs html, css files, creates HTML string with js file based on type of email
 * @param {*} data
 * @param {*} name
 */
function createEmail(data, name) {
    let htmlFile;
    let cssFile;
    let jsFile;

    switch (name) {
    case 'reset':
        htmlFile = emailLookup.resetPasswordEmail.htmlFile;
        cssFile = emailLookup.resetPasswordEmail.cssFile;
        jsFile = emailLookup.resetPasswordEmail.jsFile;
        break;
    case 'verify':
        htmlFile = emailLookup.verifyEmailEmail.htmlFile;
        cssFile = emailLookup.verifyEmailEmail.cssFile;
        jsFile = emailLookup.verifyEmailEmail.jsFile;
        break;
    case 'info':
        return null;
    default:
        return null;
    }
    return new Promise((resolve, reject) => {
        Promise.all([
            getFile(cssFile),
            getFile(htmlFile),
        ]).then(([style, template]) => {
            const emailElement = React.createElement(jsFile, data);
            const content = ReactDOMServer.renderToStaticMarkup(emailElement);

            let emailHTML = template;
            emailHTML = emailHTML.replace(CONTENT_TAG, content);
            emailHTML = emailHTML.replace(STYLE_TAG, style);

            resolve(emailHTML);
        });
    });
}

export default createEmail;
