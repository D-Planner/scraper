import fs from 'fs';
import cheerio from 'cheerio';
import request from 'sync-request';
import courses from '../../spider/data/courses.json';
import departmentsJson from '../../spider/data/departments.json';

// Helpers
import emptyCourses from '../data/emptyCourses.json';
import dictionary from '../data/manualEntered.json';
import needsChecking from '../data/needsChecking.json';

const departmentRegEx = RegExp(departmentsJson.departments.map((dep) => {
  return dep.code;
}).join('|'));


// Sift out Empty Courses
// ----------------------------------------
// const emptyCourses = courses.filter((course) => {
//   return prerequisites[course.title].length === 0;
// }).map((course) => {
//   return course.title;
// });
// fs.writeFile('data/emtpyCourses.json', JSON.stringify(emptyCourses), (e) => {
//   if (e) throw e;
//   console.log('Saved');
// });

const allPrerequisites = {};

function save(title, prerequisites) {
  allPrerequisites[title] = prerequisites;
}

courses
  .forEach((c, j) => {
    const prerequisites = [];
    if (emptyCourses.includes(c.title) || needsChecking.includes(c.title)) {
      save(c.title, prerequisites);
      return;
    }
    if (c.orc_url) { // Some don't have a url
      // console.log(j, courses.length);
      const val = request('GET', c.orc_url); // Get url data
      const lastDepartment = c.department;
      try {
        const $ = cheerio.load(val.body);

        let getNext = false;
        let preReqText = '';

        $('div[id=main]')
          .contents()
          .each(function (i, elm) {
            if (elm.tagName === 'h3') getNext = false;
            if (getNext) {
              preReqText += $(this).text().trim()
                .split('Offered')[0]
                .split('The Timetable of Class Meetings')[0]
                .split('Please read the')[0];
            }
            if ($(this).text().trim().includes('Prerequisite')) {
              // Get data immediatly following that which contains Prerequisite, which is always in a <h3> element
              getNext = true;
            }
          });
        if (preReqText.length > 1) {
          // Check if we have entered this one by hand
          if (Object.keys(dictionary).includes(preReqText)) {
            save(c.title, dictionary[preReqText]);
            return;
          }
          const courseMatches = preReqText
            .replace(/\w{3,4}(\s|-)\d{1,3}/g, (x) => {
              return (`${x}@#$%^`);
            })
            .split('@#$%^')
            .filter((x) => {
              return (
                x.match(/\d/) // We need a number of some sort
                && !x.includes('offered') // This is along with the term data below
                && !x.match(/\d{1,3}(F|W|S|X)/) // We don't want term Data
                && !x.includes(':') // This saves some caseSensitive
                && !x.includes('Timetable of Class Meetings')
                && !x.includes('formerly')
                && !x.includes('How To Apply To')
              );
            });
          let currIdx = 0;
          let currKey = '';
          let delay = false;
          courseMatches.forEach((m, i) => {
            if (m.includes('abroad')) {
              prerequisites.push({ abroad: true });
              currIdx += 1;
              return;
            }
            let trimmed = m
              .match(/(\w{3,4})?(\s|-)\d{1,3}/)
              .shift()
              .replace('-', ' ')
              .trim()
              .toUpperCase();

            let tokens = trimmed.split(' ');
            if (!departmentRegEx.test(tokens[0])) {
              if (tokens.length === 1) tokens.unshift(lastDepartment);
              else tokens[0] = lastDepartment;
            } else {
              tokens = [tokens[0].match(departmentRegEx)[0], tokens[1]];
            }
            trimmed = `${tokens[0]} ${(`00${tokens[1]}`).slice(-3)}`;

            // 'one of' means that we are going to have a requirement with a few options
            // 'and' means that we are moving on to a new requirement
            // We only want to increment to start a new requirement if delay is false
            // We never start a new req on first iteration
            if ((m.includes('one of') || m.includes('and') || m.includes('among')) && !delay && i !== 0) {
              currIdx += 1;
            }
            // This means it is time to create a new requirment object
            if (prerequisites.length === currIdx) {
              // This is a range object, from one course to another
              // These needs to be checked by hand, becuase sometimes 'from' is a range, and sometimes it is 'one form' which can be either
              if ((m.includes('between') || m.includes('from')) && !m.includes('among')) {
                prerequisites.push({
                  range: [],
                });
                currKey = 'range';
              } else if (m.includes('grade') || m.includes('score')) {
                prerequisites.push({
                  grade: [],
                });
                currKey = 'grade';
              } else {
                prerequisites.push({
                  req: [],
                });
                currKey = 'req';
              }
            }

            // This makes sure we don't add the same course twice
            if (currKey !== ''
            && !prerequisites[currIdx][currKey].includes(trimmed)
            ) prerequisites[currIdx][currKey].push(trimmed);

            // The delay
            // explanation
            if ((m.includes('one of') || m.includes('and') || m.includes('among')) && delay) {
              currIdx += 1;
              delay = false;
            }
            if (m.includes('between') || m.includes('from')) delay = true;
          });
        }
      } catch (e) {
        console.log(e);
        console.log(`Issue Parsing: ${c.orc_url}`);
      }
      save(c.title, prerequisites);
    }
  });

fs.writeFile('data/prerequisites4.json', JSON.stringify(allPrerequisites), (e) => {
  if (e) throw e;
  console.log('Saved');
});
