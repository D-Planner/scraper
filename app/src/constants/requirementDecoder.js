/* eslint-disable no-useless-constructor */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
// import cosc from '../../../api/static/data/majors/cosc.json';

/**
 * @param {requirement} requirement  A requirement object.
 * @param {plan} p The user's current plan object.
 * @returns {requirement} The same requirement object, but with fields `done` correctly set based on the user's plan.
 */
export default class RequirementDecoder {
  constructor(plan) {
    // this.requirement = requirement;
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
    requirement.done = false;
    requirement.requirements = s;
    return requirement;
  }

  decode(requirement) {
    return new Promise((resolve) => {
      // base case
      if (typeof requirement.requirements === 'string') {
        const outcomes = this.parseStringToReqObject(requirement.requirements);
        console.log(outcomes);
        outcomes.requirements = outcomes.requirements.map((subReq) => {
          this.plan.terms.forEach((t) => {
            t.courses.forEach((c) => {
              if (c.department === outcomes.department) {
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

// const cosc = {
//   name: 'Computer Science',
//   department: 'COSC',
//   link: 'http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/Computer-Science',
//   requirements: [
//     {
//       name: 'Prerequisites',
//       description: '',
//       relationship: 'AND',
//       requirements: [
//         {
//           name: 'COSC 1 or ENGS 20',
//           description: 'ENGS 20 may substitute for COSC 1, though we recommend COSC 1 for students planning to take COSC 10.',
//           relationship: 'OR',
//           requirements: 'COSC 1',
//         },
//         {
//           name: 'COSC 10',
//           description: 'COSC 10',
//           relationship: 'OR',
//           requirements: 'COSC 10',
//         },
//       ],
//     },
//     {
//       name: 'Core',
//       relationship: 'AND',
//       requirements: [
//         {
//           name: 'COSC 30-49 x2',
//           description: 'Courses in theory and algorithms.',
//           relationship: 'AND',
//           requirements: [
//             {
//               name: 'COSC 30-49 [1]',
//               description: 'First computer science course numbered 30 to 49',
//               requirements: 'COSC 30-49',
//             },
//             {
//               name: 'COSC 30-49 [2]',
//               description: 'Second computer science course numbered 30 to 49',
//               requirements: 'COSC 30-49',
//             },
//           ],
//         },
//         {
//           name: 'COSC 50-69 x2',
//           relationship: 'AND',
//           description: 'Courses in Courses in systems and hardware.',
//           requirements: [
//             {
//               name: 'COSC 50-69 [2]',
//               description: 'First computer science course numbered 50 to 69',
//               requirements: 'COSC 50-69',
//             },
//             {
//               name: 'COSC 50-69 [2]',
//               description: 'Second computer science course numbered 50 to 69',
//               requirements: 'COSC 50-69',
//             },
//           ],
//         },
//         {
//           name: 'COSC 70-89 x2',
//           description: 'Courses in applied computer science.',
//           relationship: 'AND',
//           requirements: [
//             {
//               name: 'COSC 70-89 [1]',
//               description: 'First computer science course numbered 70 to 89',
//               requirements: 'COSC 70-89',
//             },
//             {
//               name: 'COSC 70-89 [2]',
//               description: 'Second computer science course numbered 70 to 89',
//               requirements: 'COSC 70-89',
//             },
//           ],
//         },
//         {
//           name: 'Additional courses x3',
//           description: 'Final part of the core computer science major.',
//           relationship: 'AND',
//           requirements: [
//             {
//               name: 'COSC 30-89 x2',
//               description: 'Electives courses in computer science.',
//               relationship: 'AND',
//               requirements: [
//                 {
//                   name: 'COSC 30-89 [1]',
//                   description: 'First elective computer science course.',
//                   requirements: 'COSC 30-89',
//                 },
//                 {
//                   name: 'COSC 30-89 [2]',
//                   description: 'Second elective computer science course.',
//                   requirements: 'COSC 30-89',
//                 },
//               ],
//             },
//             {
//               name: 'COSC 30-89 or COSC 94 or MATH 20 beyond',
//               description: 'An elective, or COSC 94, or a math course numbered 20 or greater that is not a prerequisite to the math major and is not a seminar or a reading course.',
//               relationship: 'OR',
//               requirements: [
//                 {
//                   name: 'COSC 30-89 [3]',
//                   description: 'Third elective computer science course.',
//                   requirements: 'COSC 30-89',
//                 },
//                 {
//                   name: 'COSC 94',
//                   description: '',
//                   requirements: 'COSC 94',
//                 },
//                 {
//                   name: 'MATH 20 beyond',
//                   description: 'A math course numbered 20 or greater that is not a prerequisite to the math major and is not a seminar or a reading course.',
//                   requirements: 'MATH 20-93 95-99',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       name: 'Culminating',
//       relationship: 'OR',
//       requirements: [
//         {
//           name: 'COSC 98 x2 (Project)',
//           description: 'Two consecutive terms of COSC 98 project-based culminating experience.',
//           relationship: 'AND',
//           requirements: [
//             {
//               name: 'COSC 98',
//               description: '',
//               requirements: 'COSC 98',
//             },
//             {
//               name: 'COSC 98',
//               description: '',
//               requirements: 'COSC 98',
//             },
//           ],
//         },
//         {
//           name: 'COSC 99 x2 (Thesis)',
//           description: 'Two consecutive terms of COSC 99 thesis-based culminating experience.',
//           relationship: 'AND',
//           requirements: [
//             {
//               name: 'COSC 99',
//               description: '',
//               requirements: 'COSC 99',
//             },
//             {
//               name: 'COSC 99',
//               description: '',
//               requirements: 'COSC 99',
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// // const decoder = new RequirementDecoder();
// // console.log(decoder.decode(cosc));
