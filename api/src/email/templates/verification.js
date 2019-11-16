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
                user.emailVerificationKey = rand.generateKey(keyLength);
                user.emailVerificationKeyTimeout = Date.now() + timeoutDuration;
                user.save().then(() => {
                    console.log('verification key', user.emailVerificationKey);
                    console.log('verification timeout', user.emailVerificationKeyTimeout);

                    resolve(user.emailVerificationKey);
                });
            } else if (type === 'p') {
                user.passwordVerificationKey = rand.generateKey(keyLength);
                user.passwordVerificationKeyTimeout = Date.now() + timeoutDuration;
                user.save().then(() => {
                    console.log('user', user);
                    console.log('verification key', user.passwordVerificationKey);
                    console.log('verification timeout', user.passwordVerificationKeyTimeout);

                    resolve(user.passwordVerificationKey);
                });
            } else {
                reject(new Error('Incorrect \'type\' parameter entered:', type));
            }
        }).catch((error) => {
            reject(error);
        });
    });
}
