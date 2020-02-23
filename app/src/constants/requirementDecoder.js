/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
/**
 * @param {requirement} requirement  Arequirement object.
 * @param {plan} p The user's current plan object.
 * @returns {requirement} The same requirement object, but with fields `done` correctly set based on the user's plan.
 */
export default class requirementDecoder {
  constructor(requirement, plan) {
    this.requirement = requirement;
    this.plan = plan;
  }

  /**
   * Converts the base-level requirement string like "COSC 30-50 | 60" to {department: "COSC", requirements: [{isRange: true, lowerBound: 30, upperBound: 50}, {isRange: false, number: 60}]}.
   * @param {String} s
   */
  parseStringToReqObject(s) {
    s = s.split(' ');
    const requirement = { department: s[0] };
    s = s.slice(1); // goes from "COSC 10-30 50-60" to "10-30 50-60"
    s.map((subRange) => {
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
    requirement.requirements = s;
    return requirement;
  }

  decode(requirement) {
    return new Promise((resolve) => {
      // base case
      if (typeof requirement.requirements === 'string') {
        const outcomes = this.parseStringToReqObject(requirement.requirements);
        outcomes.requirements.map((subReq) => {
          this.plan.terms.forEach((t) => {
            t.courses.forEach((c) => {
              if (c.department === subReq.department) {
                if (subReq.isRange) {
                  if (c.number >= subReq.lowerBound && c.number <= subReq.upperBound) {
                    subReq.coursesUsedToFulfill.append(c.id);
                    return true;
                  } else if (c.number === subReq.number) {
                    subReq.coursesUsedToFulfill.append(c.id);
                    return true;
                  }
                } else if (c.number === subReq.number) {
                  subReq.coursesUsedToFulfill.append(c.id);
                  return true;
                }
              }
            });
          });
          return false;
        });
        let done = false;
        outcomes.requirements.forEach((outcome) => {
          if (!outcome) done = false;
        });
        resolve(done);
      } else { // generic case
        const toDo = requirement.requirements.map((subReq) => {
          return new Promise((subResolve) => {
            this.decode(subReq).then(outcome => subResolve(outcome));
          });
        });
        Promise.all(toDo).then((outcomes) => {
          let done = false;
          outcomes.forEach((outcome) => {
            if (!outcome) done = false;
          });
          resolve(done);
        });
      }
    });
  }
}
