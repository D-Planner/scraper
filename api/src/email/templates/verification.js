import rand from 'generate-key';
import User from '../../models/user';

require('dotenv').config();

const host = process.env.host || 'localhost:9090';
const frontendHost = process.env.host || 'http://localhost:8080';

export const timeoutDuration = 7200000;

export function generateVerificationEmail(userID) {
    return (new Promise((resolve, reject) => {
        User.findById(userID).then((user) => {
            console.log('user');
            console.log(user);
            // resolve(`<div><div>This is text, with a number! ${user.verificationKeyTimeout}</div><table width="100%" cellspacing="0" cellpadding="0">
            //     <tr><td><table cellspacing="0" cellpadding="0"><tr><td style="border-radius: 2px;" bgcolor="#ED2939">
            //         <a href="${frontendHost}/email/${user.verificationKey}" target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">Click</a>
            //     </td></tr></table></td></tr></table></div>`);
            // resolve(
            //     `<div>
            //     <div class="title">Verify your email!</div>
            //     <div class="subtitle">D-Planner, the future of course election</div>
            //     <p>If you did’t request a password reset, please delete this email and nothing will happen. Otherwise, click the link below to verify that you own this email address!</p>
            //     <p>Verify your email here!</p>
            //     <a href="${frontendHost}/email/${user.verificationKey}" target="_blank" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">Click</a>
            //     <p>D-Planner, ©2019</p>
            //     </div>`
            // );
            resolve(`<html>
              <div>
                <div class="title">Verify your email!</div>
                <div class="subtitle">D-Planner, the future of course election</div>
                <p>If you didn’t request to verify your email, please delete this email and nothing will happen. Otherwise, click the link below to verify that you own this email address!</p>
                <a href="${frontendHost}/email/${user.emailVerificationKey}" target="_blank" id="verify">Click</a>
                <p>D-Planner, ©2019</p>
              </div>
            
              <script type="text/javascript">
                document.getElementById("verify").onclick = function () {
                  location.href = "http://www.d-planner.com";
                };
              </script>
            
              <style>
                @import url('https://fonts.googleapis.com/css?family=Poppins|Roboto');
            
                html {
                  font-family: 'Poppins', sans-serif;
                  width: 900px;
                  margin: 16px auto;
                  display: flex;
                  flex-direction: column;
                }
            
                .title {
                  font-style: normal;
                  font-weight: bold;
                  font-size: 48px;
                  color:#574966;
                }
            
                .subtitle {
                  font-style: normal;
                  font-weight: bold;
                  font-size: 30px;
                  color:#574966;
                }
            
                #verify {
                  display: flex;
                  justify-content: center;
                  align-items: center;
            
                  border-radius: 20px;
                  margin: 2px;
                  color: red;
            
                  width: 40%;
                  height: 36px;
            
                  display: flex;
                  justify-content: center;
                  align-items: center;
            
                  background: none;
                  -webkit-text-fill-color: transparent;
            
                  font-weight: bold;
                  font-size: 16px;
                  text-transform: uppercase;
                }
              </style>
            </html>`);
        }).catch((error) => {
            console.error(error);
            reject(error);
        });
    }));
}

export function generateResetPassEmail(userID) {
    return (new Promise((resolve, reject) => {
        User.findById(userID).then((user) => {
            resolve(`<html>
              <div>
                <div class="title">Reset your password!</div>
                <div class="subtitle">D-Planner, the future of course election</div>
                <p>If you didn’t request a password reset, please delete this email and nothing will happen. Otherwise, click the link below to create a new password!</p>
                <a href="${frontendHost}/pass/${user.passwordVerificationKey}" target="_blank" id="verify">Click</a>
                <p>D-Planner, ©2019</p>
              </div>
            
              <script type="text/javascript">
                document.getElementById("verify").onclick = function () {
                  location.href = "http://www.d-planner.com";
                };
              </script>
            
              <style>
                @import url('https://fonts.googleapis.com/css?family=Poppins|Roboto');
            
                html {
                  font-family: 'Poppins', sans-serif;
                  width: 900px;
                  margin: 16px auto;
                  display: flex;
                  flex-direction: column;
                }
            
                .title {
                  font-style: normal;
                  font-weight: bold;
                  font-size: 48px;
                  color:#574966;
                }
            
                .subtitle {
                  font-style: normal;
                  font-weight: bold;
                  font-size: 30px;
                  color:#574966;
                }
            
                #verify {
                  display: flex;
                  justify-content: center;
                  align-items: center;
            
                  border-radius: 20px;
                  margin: 2px;
                  color: red;
            
                  width: 40%;
                  height: 36px;
            
                  display: flex;
                  justify-content: center;
                  align-items: center;
            
                  background: none;
                  -webkit-text-fill-color: transparent;
            
                  font-weight: bold;
                  font-size: 16px;
                  text-transform: uppercase;
                }
              </style>
            </html>`);
        }).catch((error) => {
            console.error(error);
            reject(error);
        });
    }));
}

/**
 * Sets a random string for email/pass verification key, gives timeout of two hours
 * @param {*} userID
 * @param {*} type
 */
export function setVerificationKey(userID, type) {
    return new Promise((resolve, reject) => {
        User.findById(userID).then((user) => {
            if (type === 'e') {
                console.log('type \'e\'');
                user.emailVerificationKey = rand.generateKey(40);
                // UPDATED FOR TESTING
                user.emailVerificationKeyTimeout = Date.now() + timeoutDuration;
                user.save().then(() => {
                    console.log('verification key', user.emailVerificationKey);
                    console.log('verification timeout', user.emailVerificationKeyTimeout);

                    resolve(user.emailVerificationKey);
                });
            } else if (type === 'p') {
                console.log('type \'p\'');
                user.passwordVerificationKey = rand.generateKey(40);
                // UPDATED FOR TESTING
                user.passwordVerificationKeyTimeout = Date.now() + timeoutDuration;
                user.save().then(() => {
                    console.log('verification key', user.passwordVerificationKey);
                    console.log('verification timeout', user.passwordVerificationKeyTimeout);

                    resolve(user.emailVerificationKey);
                });
            } else {
                console.log('type not supported');
                reject(new Error('Incorrect \'type\' parameter entered:', type));
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

/**
 * Removes verification key and timeout from email/password
 * @param {*} userID
 * @param {*} type
 */
// export function removeVerificationKey(userID, type) {
//     User.findById(userID).then((user) => {
//         if (type === 'e') {
//             user.emailVerificationKey = -1;
//             user.emailVerificationKeyTimeout = -1;
//             user.save();
//             console.log('verification removed');
//         } else if (type === 'p') {
//             user.passwordVerificationKey = -1;
//             user.passwordVerificationKeyTimeout = -1;
//             user.save();
//             console.log('verification removed');
//         } else {
//             console.log('Incorrect \'type\' parameter entered', type);
//         }
//     });
// }
