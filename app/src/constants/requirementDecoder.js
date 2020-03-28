/* eslint-disable no-useless-constructor */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
// import cosc from '../../../api/static/data/majors/cosc.json';

/**
 * @param {requirement} requirement  A requirement object.
 * @param {UserCourse} userCourses The user's current courses.
 * @returns {requirement} The same requirement object, but with fields `done` correctly set based on the user's courses.
 */
export default class RequirementDecoder {
  constructor(userCourses, major) {
    this.userCourses = userCourses;
    this.major = major;
    this.failed = [];
    this.checkOrder = [];
  }

  /**
   * Converts the base-level requirement string like "COSC 30-50 | 60" to {department: "COSC", requirements: [{isRange: true, lowerBound: 30, upperBound: 50}, {isRange: false, number: 60}]}.
   * @param {String} s
   */
  parseStringToReqObject(s) {
    s = s.split(' ');
    const requirement = { department: s[0] };
    s = s.slice(1); // goes from "COSC 10-30 50-60" to "10-30 50-60"
    s = s.map((subRange) => {
      const obj = {};
      obj.isRange = false;
      if (subRange.includes('-')) { // we detect that it is a range "50-60" rather than just "50"
        obj.isRange = true;
        obj.lowerBound = parseInt(subRange.split('-')[0], 10);
        obj.upperBound = parseInt(subRange.split('-')[1], 10);
        return obj;
      } else {
        obj.number = parseInt(subRange, 10);
        return obj;
      }
    });
    requirement.coursesUsedToFulfill = [];
    requirement.done = false;
    requirement.requirements = s;
    return requirement;
  }

  decode() {
    return new Promise((resolve) => {
      console.log('Attempting to satisfy majors with these courses:', this.userCourses);
      this.decodehelper(this.major).then((passed) => {
        console.log('Major fulfilled:', passed);
        console.log('Checking order:', this.checkOrder);
        console.log('Missed reqs:', this.failed);
        resolve(this.failed);
      });
    });
  }

  cleanCourseNumber = (courseNumber) => {
    return Math.round(courseNumber);
  }

  decodehelper(requirement) {
    return new Promise((resolve) => {
      // base case
      if (typeof requirement.requirements === 'string') {
        this.checkOrder.push(requirement);
        let print = false;
        if (requirement.requirements === 'COSC 30-49') print = true;
        const outcomes = this.parseStringToReqObject(requirement.requirements);
        outcomes.requirements = outcomes.requirements.map((subReq) => {
          let fulfilled = false;
          this.userCourses.forEach((c) => {
            if (c.course.department === outcomes.department && c.major === null && outcomes.coursesUsedToFulfill.length === 0) {
              if (subReq.isRange) {
                if (this.cleanCourseNumber(c.course.number) >= subReq.lowerBound && this.cleanCourseNumber(c.course.number) <= subReq.upperBound) {
                  outcomes.coursesUsedToFulfill.push(c.course.id);
                  c.major = 'COSC';
                  fulfilled = true;
                }
              } else if (this.cleanCourseNumber(c.course.number) === subReq.number) {
                outcomes.coursesUsedToFulfill.push(c.course.id);
                c.major = 'COSC';
                fulfilled = true;
              }
            }
          });
          return fulfilled;
        });

        let done = true;
        outcomes.requirements.forEach((outcome) => {
          if (!outcome) done = false;
        });
        resolve(done);
      } else { // generic case
        let print = false;
        if (requirement.name === 'COSC 30-49 x2') print = false;
        const toDo = requirement.requirements.map((subReq) => {
          return new Promise((subResolve) => {
            this.decodehelper(subReq).then((outcome) => {
              if (!outcome) this.failed.push(subReq);
              subResolve(outcome);
            });
          });
        });
        Promise.all(toDo).then((outcomes) => {
          if (print) console.log(outcomes);
          let done = null;
          if (requirement.relationship === 'AND') done = true;
          if (requirement.relationship === 'OR') done = false;
          outcomes.forEach((outcome) => {
            if (!outcome && requirement.relationship === 'AND') done = false;
            if (outcome && requirement.relationship === 'OR') done = true;
          });
          resolve(done);
        });
      }
    });
  }
}
