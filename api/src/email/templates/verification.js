import User from '../../models/user';

require('dotenv').config();

const host = process.env.host || 'localhost:9090';

export function generateVerificationEmail(userID) {
    User.findById(userID).then((user) => {
        console.log('generate verification email');
        console.log(user.first_name);
        console.log(user.email);
        console.log('verification', user.verificationKey);
        console.log('timeout', user.verificationKeyTimeout);
    });
    return (
        null
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
    );
}

export function setVerificationKey(userID) {
    User.findById(userID).then((user) => {
        console.log('user found!');
        // console.log(user);
        user.verificationKey = Math.floor((Math.random() * 1000000000000000) + Math.floor(Math.random() * 100000000)); // TODO: Improve this line
        user.verificationKeyTimeout = Date.now() + 7200000; // Two hours in the future
        user.save();

        console.log('verification key', user.verificationKey);
        console.log('verification timeout', user.verificationKeyTimeout);
    });
}

export function removeVerificationKey(userID) {
    User.findById(userID).then((user) => {
        console.log('user found!');
        user.verificationKey = -1;
        user.verificationKeyTimeout = -1;
        user.save();
        console.log(user);
        console.log(createVerificationURL(user.verificationKey));
    });
}

// For generating random link in the format '{HOST}/verify?id={KEY}'
export function createVerificationURL(key) {
    return (`${host}/auth/email?id=${key}`);
}
