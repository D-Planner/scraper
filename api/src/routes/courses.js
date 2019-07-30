import { Router } from 'express';
import CoursesController from '../controllers/courses_controller';

const coursesRouter = Router();

/**
 * @api {get} /search Search For Courses
 * @apiName Search
 * @apiGroup Courses
 *
 * @apiSuccess {Array} courses the list of courses that satisfy search
 *
 * @apiUse CoursesSuccessExample
 */
coursesRouter.get('/search', CoursesController.searchCourses);

/**
 * @api {post} /create Seed the database
 * @apiName Create
 * @apiGroup Courses
 * *
 * @apiUse CoursesSuccessExample
 */
coursesRouter.post('/create', CoursesController.createCourse);

/**
 * @api {get} /courses/favorite Get favorite courses
 * @apiName GetFavorites
 * @apiGroup Courses
 *
 * @apiSuccess {Array} favorite_courses the list of a user's favorite courses
 *
 * @apiUse CoursesSuccessExample
 */
coursesRouter.get('/favorite', CoursesController.getFavorite);

/**
 * @api {post} /courses/placement/:id Add course to Placement
 * @apiName addToPlacements
 * @apiGroup Courses
 *
 * @apiParam {String} id the id of the course object to add to placement
 *
 * @apiSuccess {Object} user the user object with the new course added to their placement
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "favorite_courses": [
 *              "5c76db2df37f2dc9348f890a"
 *          ],
 *          "completed_courses": [],
 *          "majors": [
 *              "5ceda41ad78037c2c039affa"
 *          ],
 *          "_id": "5c52a8940dadc9e7ae96e1e2",
 *          "email": "a@a.com",
 *          "password": "$2a$10$SjegbbEiUR.dJBnC5JQ0aeWUVOeYgaVosdXI7F0U/S9OAi2kVlBom",
 *          "__v": 0,
 *          "id": "5c52a8940dadc9e7ae96e1e2"
 *      }
 */
/**
  * @api {delete} /courses/placement/:id Delete course from Placement
  * @apiName removeFromPlacements
  * @apiGroup Courses
  *
  * @apiParam {String} id the id of the course object to removed from placement
  *
  */
coursesRouter.route('/placement/:id')
    .post(CoursesController.addPlacement)
    .delete(CoursesController.removePlacement);

/**
 * @api {post} /courses/favorite/:id Add course to favorites
 * @apiName AddToFavorites
 * @apiGroup Courses
 *
 * @apiParam {String} id the id of the course object to add to favorites
 *
 * @apiSuccess {Object} user the user object with the new course added to their favorites
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "favorite_courses": [
 *              "5c76db2df37f2dc9348f890a"
 *          ],
 *          "completed_courses": [],
 *          "majors": [
 *              "5ceda41ad78037c2c039affa"
 *          ],
 *          "_id": "5c52a8940dadc9e7ae96e1e2",
 *          "email": "a@a.com",
 *          "password": "$2a$10$SjegbbEiUR.dJBnC5JQ0aeWUVOeYgaVosdXI7F0U/S9OAi2kVlBom",
 *          "__v": 0,
 *          "id": "5c52a8940dadc9e7ae96e1e2"
 *      }
 */

/**
 * @api {delete} /courses/:id Remove course from favorites
 * @apiName RemoveFromFavorites
 * @apiGroup Courses
 *
 * @apiParam {String} id the id of the course object to remove from favorites
 *
 * @apiSuccess {Object} user the user object with the course removed from their favorites
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "favorite_courses": [],
 *          "completed_courses": [],
 *          "majors": [
 *              "5ceda41ad78037c2c039affa"
 *          ],
 *          "_id": "5c52a8940dadc9e7ae96e1e2",
 *          "email": "a@a.com",
 *          "password": "$2a$10$SjegbbEiUR.dJBnC5JQ0aeWUVOeYgaVosdXI7F0U/S9OAi2kVlBom",
 *          "__v": 0,
 *          "id": "5c52a8940dadc9e7ae96e1e2"
 *      }
 */
coursesRouter.route('/favorite/:id')
    .post(CoursesController.addFavorite)
    .delete(CoursesController.removeFavorite);

/**
 * @api {post} /courses/completed/:id Add course to Completed
 * @apiName addToCompleted
 * @apiGroup Courses
 *
 * @apiParam {String} id the id of the course object to add to completed
 *
 * @apiSuccess {Object} user the user object with the new course added to their completed
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "favorite_courses": [
 *              "5c76db2df37f2dc9348f890a"
 *          ],
 *          "completed_courses": [],
 *          "majors": [
 *              "5ceda41ad78037c2c039affa"
 *          ],
 *          "_id": "5c52a8940dadc9e7ae96e1e2",
 *          "email": "a@a.com",
 *          "password": "$2a$10$SjegbbEiUR.dJBnC5JQ0aeWUVOeYgaVosdXI7F0U/S9OAi2kVlBom",
 *          "__v": 0,
 *          "id": "5c52a8940dadc9e7ae96e1e2"
 *      }
 */
/**
  * @api {delete} /courses/completed/:id Delete course from Completed
  * @apiName removeFromCompleted
  * @apiGroup Courses
  *
  * @apiParam {String} id the id of the course object to removed from completed
  *
  */

coursesRouter.route('/completed/:id')
    .get(CoursesController.getCompleted)
    .post(CoursesController.addCompleted)
    .delete(CoursesController.removeCompleted);

coursesRouter.get('/:department&:number', CoursesController.getCourseByNumber);

coursesRouter.get('/departments/:department', CoursesController.getCoursesByDepartment);

coursesRouter.get('/distribs/:distrib', CoursesController.getCoursesByDistrib);

coursesRouter.get('/wcs/:wc', CoursesController.getCoursesByWC);

/**
 * @api {get} /courses/:id Get course by id
 * @apiName GetCourseByID
 * @apiGroup Courses
 *
 * @apiSuccess {Object} course the requested course object
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "distribs": [],
 *          "xlist": [],
 *          "periods": [],
 *          "reviews": [],
 *          "similar_courses": [],
 *          "medians": [
 *              {
 *                  "term": "18F",
 *                  "courses": [
 *                      {
 *                          "enrollment": 29,
 *                          "median": "A",
 *                          "numeric_value": 12,
 *                          "section": 1
 *                      }
 *                  ],
 *                  "avg_numeric_value": 12
 *              }
 *          ],
 *          "terms_offered": [
 *              "18F"
 *          ],
 *          "professors": [
 *              "Laura McPherson",
 *              "Theodore Levin"
 *          ],
 *          "_id": "5c76db2df37f2dc9348f890a",
 *          "links": [
 *              {
 *                  "orc": "http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/College-Courses/COCO-College-Courses/COCO-23",
 *                  "layuplist": "https://www.layuplist.com/course/4348",
 *                  "learning_objective": "https://oracle-www.dartmouth.edu/dart/groucho/course_desc.display_learning_objectives?p_term=201809&p_crn=90644",
 *                  "textbook": "https://oracle-www.dartmouth.edu/dart/groucho/course_desc.display_non_fys_req_mat?p_term=201809&p_crn=90644"
 *              }
 *          ],
 *          "related_courses": [
 *              3377,
 *              214,
 *              138,
 *              2158,
 *              2488,
 *              3858,
 *              3877,
 *              1085
 *          ],
 *          "name": "Language-Music Connection",
 *          "department": "COCO",
 *          "number": 23,
 *          "section": 1,
 *          "crn": 90644,
 *          "enroll_limit": 25,
 *          "current_enrollment": 29,
 *          "timeslot": "2A",
 *          "room": "Faulkner",
 *          "building": "Hopkins Center",
 *          "description": "Language and music are universal components of human experience, so integral that they are often considered part of what defines us as humans. While we treat them as distinct phenomena, the overlap between the two is immense, structurally, neurologically, and culturally. Such connections have long been recognized, but recent research from diverse fields like linguistics, (ethno)musicology, cognitive psychology, anthropology, and neuroscience continues to reveal just how intertwined the two faculties are. Drawing on this body of research and our respective specialties, we explore the language-music connection from the basic ingredients (pitch, timbre, rhythm, syntax), to cultural expression, to evolution and origins. Running through the course is a hands-on case study of a West African xylophone tradition where language and music are so intimately related that they cannot be separated. Students will be taught by a master of the tradition, Mamadou Diabaté, to feel for themselves what it means to speak through an instrument.",
 *          "term": "18F",
 *          "wc": "NW",
 *          "distrib": "INT or ART",
 *          "layuplist_score": 0,
 *          "layuplist_id": 4348,
 *          "__v": 0,
 *          "id": "5c76db2df37f2dc9348f890a"
 *      }
 */
coursesRouter.get('/:id', CoursesController.getCourse);

/**
 * @api {get} /courses/ Get all courses
 * @apiName GetCourses
 * @apiGroup Courses
 *
 * @apiSuccess {Array} courses a list of all courses in the db
 *
 * @apiUse CoursesSuccessExample
 */
coursesRouter.get('/', CoursesController.getCourses);


/**
 * @apiDefine CoursesSuccessExample
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      [
 *          {
 *              "distribs": [],
 *              "xlist": [],
 *              "periods": [],
 *              "reviews": [],
 *              "similar_courses": [],
 *              "medians": [
 *                  {
 *                      "term": "18F",
 *                      "courses": [
 *                          {
 *                              "enrollment": 29,
 *                              "median": "A",
 *                              "numeric_value": 12,
 *                              "section": 1
 *                          }
 *                      ],
 *                      "avg_numeric_value": 12
 *                  }
 *              ],
 *              "terms_offered": [
 *                  "18F"
 *              ],
 *              "professors": [
 *                  "Laura McPherson",
 *                  "Theodore Levin"
 *              ],
 *              "_id": "5c76db2df37f2dc9348f890a",
 *              "links": [
 *                  {
 *                      "orc": "http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/College-Courses/COCO-College-Courses/COCO-23",
 *                      "layuplist": "https://www.layuplist.com/course/4348",
 *                      "learning_objective": "https://oracle-www.dartmouth.edu/dart/groucho/course_desc.display_learning_objectives?p_term=201809&p_crn=90644",
 *                      "textbook": "https://oracle-www.dartmouth.edu/dart/groucho/course_desc.display_non_fys_req_mat?p_term=201809&p_crn=90644"
 *                  }
 *              ],
 *              "related_courses": [
 *                  3377,
 *                  214,
 *                  138,
 *                  2158,
 *                  2488,
 *                  3858,
 *                  3877,
 *                  1085
 *              ],
 *              "name": "Language-Music Connection",
 *              "department": "COCO",
 *              "number": 23,
 *              "section": 1,
 *              "crn": 90644,
 *              "enroll_limit": 25,
 *              "current_enrollment": 29,
 *              "timeslot": "2A",
 *              "room": "Faulkner",
 *              "building": "Hopkins Center",
 *              "description": "Language and music are universal components of human experience, so integral that they are often considered part of what defines us as humans. While we treat them as distinct phenomena, the overlap between the two is immense, structurally, neurologically, and culturally. Such connections have long been recognized, but recent research from diverse fields like linguistics, (ethno)musicology, cognitive psychology, anthropology, and neuroscience continues to reveal just how intertwined the two faculties are. Drawing on this body of research and our respective specialties, we explore the language-music connection from the basic ingredients (pitch, timbre, rhythm, syntax), to cultural expression, to evolution and origins. Running through the course is a hands-on case study of a West African xylophone tradition where language and music are so intimately related that they cannot be separated. Students will be taught by a master of the tradition, Mamadou Diabaté, to feel for themselves what it means to speak through an instrument.",
 *              "term": "18F",
 *              "wc": "NW",
 *              "distrib": "INT or ART",
 *              "layuplist_score": 0,
 *              "layuplist_id": 4348,
 *              "__v": 0,
 *              "id": "5c76db2df37f2dc9348f890a"
 *          }
 *      ]
 */

export default coursesRouter;
