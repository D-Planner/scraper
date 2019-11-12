import rand from 'generate-key';
import User from '../../models/user';

export const timeoutDuration = 7200000;
const keyLength = 120;

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
                user.emailVerificationKey = rand.generateKey(keyLength);
                // UPDATED FOR TESTING
                user.emailVerificationKeyTimeout = Date.now() + timeoutDuration;
                user.save().then(() => {
                    console.log('verification key', user.emailVerificationKey);
                    console.log('verification timeout', user.emailVerificationKeyTimeout);

                    resolve(user.emailVerificationKey);
                });
            } else if (type === 'p') {
                console.log('type \'p\'');
                user.passwordVerificationKey = rand.generateKey(keyLength);
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
