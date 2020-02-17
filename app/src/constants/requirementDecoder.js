/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
/**
 * @param {requirement} A requirement object.
 * @param {plan} The user's current plan object.
 * @returns {requirement} The same requirement object, but with fields `done` correctly set based on the user's plan.
 */
export default class requirementDecoder {
  constructor(requirement, plan) {
    this.requirement = requirement;
    this.plan = plan;
  }

  parseReqString(s) {
    s = s.split(' ');
    const req = { isRange: false };
    req.department = s[0];
    if (s[1].includes('-')) {
      req.isRange = true;
      req.lowerBound = parseInt(s[1].split('-')[0], 10);
      req.upperBound = parseInt(s[1].split('-')[1], 10);
    } else {
      req.number = s[1];
    }
    return req;
  }

  decode() {
    this.requirement.requirements.forEach((subReq) => {
      if (typeof subReq.requirements === 'string') {
        subReq = this.parseReqString(subReq.requirements);
        this.plan.terms.forEach((t) => {
          t.courses.forEach((c) => {
            if (c.department === subReq.department) {
              if (subReq.isRange) {
                if (c.number >= subReq.lowerBound && c.number <= subReq.upperBound) {
                  subReq.done = true;
                  subReq.coursesUsedToFulfill.append(c.id);
                } else if (c.number === subReq.number) {
                  subReq.done = true;
                  subReq.coursesUsedToFulfill.append(c.id);
                }
              }
            }
          });
        });
      } else {
        decodeHelper(subReq);
      }
    });
  }
}
