import User from '../../models/user';

require('dotenv').config();

const host = process.env.host || 'localhost:9090';
const frontendHost = process.env.host || 'http://localhost:8080';

export function generateVerificationEmail(userID) {
    return (new Promise((resolve, reject) => {
        User.findById(userID).then((user) => {
            console.log('user');
            console.log(user);
            resolve(`<div><div>This is text, with a number! ${user.verificationKeyTimeout}</div><table width="100%" cellspacing="0" cellpadding="0">
                <tr><td><table cellspacing="0" cellpadding="0"><tr><td style="border-radius: 2px;" bgcolor="#ED2939">
                    <a href="${frontendHost}/email/${user.verificationKey}" target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">Click</a>
                </td></tr></table></td></tr></table></div>`);
        }).catch((error) => {
            console.error(error);
            reject(error);
        });
    }));
    // return (
    //     null
    //   `<div>
    //     <div class="title">Verify your email!</div>
    //     <div class="subtitle">D-Planner, the future of course election</div>
    //     <p>If you did’t request a password reset, please delete this email and nothing will happen. Otherwise, click the link below to verify that you own this email address!</p>
    //     <button type="button" id="verify">
    //     Verify your email here!
    //     <!-- <div>Test Color</div> -->
    //     <!-- <div class="button-cover"><div class="button-text">Sign In</div></div> -->
    //   </button>
    //   <p>D-Planner, ©2019</p>
    // </div>`
    // );
}

export function setVerificationKey(userID) {
    return new Promise((resolve, reject) => {
        User.findById(userID).then((user) => {
            user.verificationKey = Math.floor((Math.random() * 1000000000000000) + Math.floor(Math.random() * 100000000)); // TODO: Improve this line
            user.verificationKeyTimeout = Date.now() + 7200000; // Two hours in the future
            console.log('save');
            user.save().then(() => {
                console.log('verification key', user.verificationKey);
                console.log('verification timeout', user.verificationKeyTimeout);

                resolve(user.verificationKey);
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

export function removeVerificationKey(userID) {
    User.findById(userID).then((user) => {
        user.verificationKey = -1;
        user.verificationKeyTimeout = -1;
        user.save();
        console.log('verification removed');
    });
}

// For generating random link in the format '{HOST}/email/{KEY}' for FRONTEND use (in email)
export function createVerificationURL(key) {
    return (`${host}/email/${key}`);
}
