import { Router } from 'express';
import TermController from '../controllers/term_controller';
import UserCourseController from '../controllers/user_course_controller';

const termsRouter = Router();

// I don't think I want to expose the ability to create terms to the frontend
// The createTerm functionality should really only be used by the plans controller
// termsRouter.post('/', TermController.createTerm);

/**
 * @api {post} /terms/:termID/course Add course to term
 * @apiName AddCourseToTerm
 * @apiGroup Terms
 *
 * @apiParam {String} termID the id corresponding to the term this course will be added to
 * @apiParam {Object} course the course object to add to the term
 *
 * @apiSuccess {Array} courses the list of populated courses that exist in the term (with the new course now added)
 * @apiSuccess {Number} year the year of the term
 * @apiSuccess {String} quarter the letter representing the quarter of this term
 * @apiSuccess {Boolean} off_term true if the term is an off-term and false otherwise
 * @apiSuccess {String} name the name of the term normalized as YYQ where YY is year and Q is quarter
 * @apiSuccess {String} id the unique id of the term
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "courses": [
 *              {
 *                  "_id": "5cf439849b39ad4f9b2fcffe",
 *                  "user": "5c52a8940dadc9e7ae96e1e2",
 *                  "course": "5c76db2df37f2dc9348f890f",
 *                  "term": "5c76d3eb08c20d8f9f016a72",
 *                  "major": null,
 *                  "distrib": null,
 *                  "wc": null,
 *                  "timeslot": null,
 *                  "__v": 0,
 *                  "id": "5cf439849b39ad4f9b2fcffe"
 *              }
 *          ],
 *          "_id": "5c76d3eb08c20d8f9f016a72",
 *          "year": 2015,
 *          "quarter": "F",
 *          "off_term": false,
 *          "__v": 6,
 *          "name": "15F",
 *          "id": "5c76d3eb08c20d8f9f016a72"
 *      }
 */
termsRouter.post('/:termID/course', TermController.addCourseToTerm);

/**
 * @api {delete} /terms/:termID/course/:userCourseID Remove course from term
 * @apiName RemoveCourseFromTerm
 * @apiGroup Terms
 *
 * @apiParam {String} termID the id corresponding to the term this course will be removed from
 * @apiParam {String} userCourseID the id of the userCourse that was added to this term, and will be removed
 *
 * @apiSuccess {Array} courses the list of populated courses that exist in the term (with the new course now added)
 * @apiSuccess {Number} year the year of the term
 * @apiSuccess {String} quarter the letter representing the quarter of this term
 * @apiSuccess {Boolean} off_term true if the term is an off-term and false otherwise
 * @apiSuccess {String} name the name of the term normalized as YYQ where YY is year and Q is quarter
 * @apiSuccess {String} id the unique id of the term
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "courses": [
 *              "5cdb9bd10fb265392b6cb9e3"
 *          ],
 *          "_id": "5c76d3eb08c20d8f9f016a72",
 *          "year": 2015,
 *          "quarter": "F",
 *          "off_term": false,
 *          "__v": 7,
 *          "name": "15F",
 *          "id": "5c76d3eb08c20d8f9f016a72"
 *      }
 */
termsRouter.delete('/:termID/course/:userCourseID', TermController.removeCourseFromTerm);

termsRouter.post('/:termID/course/custom', TermController.addCourseToTerm);
termsRouter.delete('/:termID/course/custom/:userCourseID', TermController.removeCourseFromTerm); // Calling this :userCourseID so we can use same removeCourseFromTerm callback

/**
 * @api {put} /terms/:id Update a term by id
 * @apiName UpdateTerm
 * @apiGroup Terms
 *
 * @apiParam {String} termID the id corresponding to the term this course will be removed from
 * @apiParam {Object} term the updated term object that will be saved to the new term
 *
 * @apiSuccess {Array} courses the list of populated courses that exist in the term (with the new course now added)
 * @apiSuccess {Number} year the year of the term
 * @apiSuccess {String} quarter the letter representing the quarter of this term
 * @apiSuccess {Boolean} off_term true if the term is an off-term and false otherwise
 * @apiSuccess {String} name the name of the term normalized as YYQ where YY is year and Q is quarter
 * @apiSuccess {String} id the unique id of the term
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "courses": [
 *              "5cdb9bd10fb265392b6cb9e3"
 *          ],
 *          "_id": "5c76d3eb08c20d8f9f016a72",
 *          "year": 2015,
 *          "quarter": "F",
 *          "off_term": false,
 *          "__v": 7,
 *          "name": "15F",
 *          "id": "5c76d3eb08c20d8f9f016a72"
 *      }
 */
termsRouter.put('/:id', TermController.updateTerm);

termsRouter.post('/update/course/:userCourseID', UserCourseController.updateUserCourse);

termsRouter.get('/:termID', TermController.getTerm);

termsRouter.get('/userCourse/:userCourseID', UserCourseController.getCourse);

export default termsRouter;
