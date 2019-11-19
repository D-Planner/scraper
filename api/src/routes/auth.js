import { Router } from 'express';
import * as UserController from '../controllers/user_controller';
import { requireSignin, requireAuth } from '../authentication/init';
import VerifyController from '../controllers/verify_controller';

const authRouter = Router();

/**
 * @api {post} /auth/signin Sign In
 * @apiName SignIn
 * @apiGroup Authentication
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password User's unhashed password
 *
 * @apiSuccess {String} token A json web token (jwt) for this user
 * @apiSuccess {Object} user the user object
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *          {
 *              "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YzUyYTg5NDBkYWRjOWU3YWU5NmUxZTIiLCJpYXQiOjE1NTk1MDQ3ODk3NzB9.ZiaGR4-5__qnwjA7Uc_aMXIeE2SXgHXnEdwhU5FH-Mc",
 *              "user": {
 *                  "favorite_courses": [],
 *                  "completed_courses": [],
 *                  "majors": [
 *                      "5ceda41ad78037c2c039affa"
 *                  ],
 *                  "_id": "5c52a8940dadc9e7ae96eaaa",
 *                  "email": "a@a.com",
 *                  "__v": 0,
 *                  "id": "5c52a8940dadc9e7ae96eaaa"
 *              }
 *          }
 */
authRouter.post('/signin', requireSignin, UserController.signin);
authRouter.post('/signinheadless', UserController.signinheadless);

/**
 * @api {post} /auth/signup Sign Up
 * @apiName SignUp
 * @apiGroup Authentication
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 *
 * @apiSuccess {String} token A json web token (jwt) for this user
 * @apiSuccess {Object} user the user object
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *          {
 *              "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YzUyYTg5NDBkYWRjOWU3YWU5NmUxZTIiLCJpYXQiOjE1NTk1MDQ3ODk3NzB9.ZiaGR4-5__qnwjA7Uc_aMXIeE2SXgHXnEdwhU5FH-Mc",
 *              "user": {
 *                  "favorite_courses": [],
 *                  "completed_courses": [],
 *                  "majors": [
 *                      "5ceda41ad78037c2c039affa"
 *                  ],
 *                  "_id": "5c52a8940dadc9e7ae96eaaa",
 *                  "email": "a@a.com",
 *                  "__v": 0,
 *                  "id": "5c52a8940dadc9e7ae96eaaa"
 *              }
 *          }
 */
authRouter.post('/signup', UserController.signup);

/**
 * @api {get} /auth/ Get the current user
 * @apiName GetUser
 * @apiGroup Authentication
 *
 * @apiSuccess {Array} favorite_courses the list of a user's favorite courses
 * @apiSuccess {Array} complete_courses the list of a user's completed courses
 * @apiSuccess {Array} majors the list of a user's declared majors
 * @apiSuccess {String} id the user's unique id in the database
 * @apiSuccess {String} email the user's email
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *          {
 *              "favorite_courses": [],
 *              "completed_courses": [],
 *              "majors": [],
 *              "_id": "5c52a8940dadc9e7ae96eaaa",
 *              "email": "a@a.com",
 *              "__v": 0,
 *              "id": "5c52a8940dadc9e7ae96eaaa"
 *          }
 */
authRouter.get('/', requireAuth, UserController.getUser);

// Delete account
authRouter.delete('/', requireAuth, UserController.deleteUser);

/**
 * @api {get} /auth/:id Get a user by id
 * @apiName GetUserById
 * @apiGroup Authentication
 *
 * @apiParam {String} id the user's unique id in the database
 *
 * @apiSuccess {Array} favorite_courses the list of a user's favorite courses
 * @apiSuccess {Array} complete_courses the list of a user's completed courses
 * @apiSuccess {Array} majors the list of a user's declared majors
 * @apiSuccess {String} id the user's unique id in the database
 * @apiSuccess {String} email the user's email
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *          {
 *              "favorite_courses": [],
 *              "completed_courses": [],
 *              "majors": [],
 *              "_id": "5c52a8940dadc9e7ae96eaaa",
 *              "email": "a@a.com",
 *              "__v": 0,
 *              "id": "5c52a8940dadc9e7ae96eaaa"
 *          }
 */
authRouter.get('/:id', requireAuth, UserController.getUser);

authRouter.post('/update', requireAuth, UserController.updateUser);

// For verifying email against key and for sending verification email, respectively
authRouter.post('/verify/email', requireAuth, VerifyController.verifyEmail);
authRouter.post('/verify/email/send', VerifyController.sendVerifyEmail);

// Forgot pasword call, checks for email and sends reset message
authRouter.post('/verify/pass/byemail', VerifyController.resetPassByEmail);

// Gets user based on URL key
authRouter.get('/verify/pass/bykey', VerifyController.getUserByKey);

// Is the password reset authorized (are the user and URL keys the same)?
authRouter.post('/verify/pass', VerifyController.authResetPass);

// Take new password and update User schema
authRouter.post('/verify/pass/reset', VerifyController.resetPass);

// Send password reset email
authRouter.post('/verify/pass/send', VerifyController.sendResetPass);

export default authRouter;
