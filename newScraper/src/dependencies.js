import cheerio from 'cheerio';
import request from 'sync-request';
import fs from 'fs';
import courses from '../data/courses.json';

 // const courses = [
 //  {'orc_url' : 'https://dartmouth.smartcatalogiq.com/current/orc/Departments-Programs-Undergraduate/Cognitive-Science/COGS-Cognitive-Science/COGS-25'},
 //  {'orc_url' : 'https://dartmouth.smartcatalogiq.com/current/orc/Departments-Programs-Undergraduate/Asian-Societies-Cultures-and-Languages/CHIN-Chinese/CHIN-32'},
 //  {'orc_url' : 'https://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/Biological-Sciences/BIOL-Biological-Sciences-Undergraduate/BIOL-76'},
 //  {'orc_url' : 'https://dartmouth.smartcatalogiq.com/current/orc/Departments-Programs-Undergraduate/Biological-Sciences/BIOL-Biological-Sciences-Undergraduate/BIOL-27'},
 //  {'orc_url' : 'https://dartmouth.smartcatalogiq.com/current/orc/Departments-Programs-Undergraduate/Geography/GEOG-Geography/GEOG-47'},
 //  {'orc_url' : 'http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/Psychological-and-Brain-Sciences/PSYC-Psychological-and-Brain-Sciences/PSYC-51-02'},
 //  {'orc_url' : 'http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Graduate/Chemistry/CHEM-Chemistry/100/CHEM-152'},
 //  {'orc_url' : 'http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/Chemistry/CHEM-Chemistry-Undergraduate/CHEM-57'},
 //  {'orc_url' : 'http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Graduate/Biological-Sciences/BIOL-Biological-Sciences/100/BIOL-129'},
 //  {'department' : 'GEOG', 'orc_url' : 'http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/Geography/GEOG-Geography/GEOG-82'}, // Has issue with betweens, but no Department name, and doesn't say between, consider changing to 'from'
 //  // Unsure on these
 //  {'department' : 'ECON', 'orc_url' : 'http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/Economics/ECON-Economics/ECON-70-01'},
 //  {'orc_url' : 'http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/Economics/ECON-Economics/ECON-73'},
 //  {'orc_url' : 'http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/Economics/ECON-Economics/ECON-70-02'},
 //  {'orc_url' : 'http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/College-Courses/COCO-College-Courses/COCO-21'}, // Text: Study abroad 2017/18
 //  {'orc_url' : 'http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/Computer-Science/COSC-Computer-Science-Undergraduate/COSC-77'} // "Math 22 or 24"
 // ];

 // From is not always a range, sometimes it means one from a list


// Loop over all courses
const allPrerequisites = courses.reduce((acc, course) => {
  // For each individual course
  if (!course.orc_url) {
    return acc;
  }
  const val = request('GET',course.orc_url);
  try {
    const $ = cheerio.load(val.body);

    let getNext = false;
    let preReqText = '';
    $('div[id=main]').contents().each(function (i, elm) {
      if(elm.tagName === 'h3') getNext = false;
      if (getNext) {
        preReqText += $(this).text().trim();
      }
      if ($(this).text().trim().includes('Prerequisite')) {
        getNext = true;
      }
    });

    if (preReqText) {
      let courseMatches = preReqText.replace(/\w{3,4}(\s|\-)\d{1,3}/g, (x) => {
        return (x + "$%&");
      }).split('$%&').filter((x) => {
        return (x.match(/\d/) && !x.match(/\d{1,3}(F|W|S|X)/) && !x.includes(':') && !x.includes('Timetable of Class Meetings'));
      });
      if (courseMatches.length > 0) {
        let currIdx = 0;
        let currKey = '';
        let prerequisites = [];
        let delay = false;

        for (let i = 0; i < courseMatches.length; i++) {
          const currMatch = courseMatches[i];
          if (currMatch.includes('/')) {
            console.log('Has "/": ' + course.title);
          }
          if (currMatch.includes('abroad')) {
            prerequisites.push({abroad:true});
            currIdx++;
            continue;
          }
          let trimmed = currMatch.match(/(\w{3,4})?(\s|\-)\d{1,3}/)[0].replace(/^(from|\-)/, '').trim();
          if(!trimmed.match(/\D/)) trimmed = course.department + ' ' + trimmed;

          if ((currMatch.includes("one of") || currMatch.includes("and")) && !delay && i !== 0) {
            currIdx++;
          }
          if (prerequisites.length === currIdx) {
            if (currMatch.includes('between') || currMatch.includes('from')) {
              prerequisites.push({
                range: [],
              });
              currKey = "range";
              console.log("Has Between: " + course.title);
            } else if (currMatch.includes('grade') || currMatch.includes('score')) {
              prerequisites.push({
                grade: [],
              })
              currKey = "grade";
              console.log("Has Grade: " + course.title);
            } else {
              prerequisites.push({
                req: [],
              });
              currKey = "req";
            }
          }
          if (currKey !== '') prerequisites[currIdx][currKey].push(trimmed);


          // The Delay
          if ((currMatch.includes("one of") || currMatch.includes("and")) && delay) {
            currIdx++;
            delay = false;
          }
          if (currMatch.includes('between') || currMatch.includes('from')) delay = true;
        }
        let newCourse = course;
        newCourse.prerequisites = prerequisites;
        acc.push(newCourse);
      }
    }
  } catch (e) {
    console.log(e);
    console.log("Issue Parsing: " + course.orc_url);
  } finally {
    return acc;
  }
}, []);

// console.log(JSON.stringify(allPrerequisites));
fs.writeFile('data/withPrereqs.json', JSON.stringify(allPrerequisites), (e) => {
  if (e) throw e;
  console.log("Saved");
  return;
});

// Courses that need checking / Fixing
// Has Grade: CHEM057: Honors Organic Chemistry
// Has Between: BIOL032: Animal Communication
// Has Between: BIOL049: Cellular and Molecular Neuroscience
// Has Between: BIOL067: The Biology of Fungi and Parasites that Cause Disease
// Has Between: BIOL051: Advanced Population Ecology
// Has Between: BIOL063: RNA: The Real Secret of Life
// Has Between: BIOL071: Current Topics in Cell Biology
// Has Between: BIOL025: Introductory Marine Biology and Ecology
// Has Between: BIOL023: Social Evolution: Cooperation and Construction Among Animal Architects
// Has Between: BIOL069: Cell Signaling
// Has Between: BIOL048: Disease, The Environment, and Human History
// Has Between: BIOL066: Molecular Basis of Cancer
// Has Between: BIOL031: Physiological Ecology
// Has Between: BIOL076: Advanced Genetics
// Has Between: BIOL028: Macroevolution
// Has "/": GEOG059: Environmental Applications of GIS
// Has Between: GEOG051: Remote Sensing
// Has Between: GEOG047: The Czech Republic in the New Europe
// Has Between: GEOG082: Independent Study in the Czech Republic
// Has Between: GEOG081: Field Research in the Czech Republic
// Has Between: EARS034: Earth’s Biogeochemical Cycles
// Has Between: EARS040: Materials of the Earth
// Has "/": EARS077: Environmental Applications of GIS
// Has Between: EARS065: Remote Sensing
// Has Between: EARS037: Marine Geology
// Has Between: EARS038: Introduction to Sedimentary Systems
// Has Between: ECON081: Advanced Topics in Microeconomics
// Has "/": COCO021: What's in Your Shoebox? Unpacking Your Study Abroad Experience
// Issue Parsing: http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/College-Courses/COCO-College-Courses/COCO-21
// Has Between: PHYS114: General Relativity and Cosmology
// Has Grade: COSC231: Advanced Algorithms
// Has Grade: COSC258: Advanced Operating Systems
// Has "/": COSC039: Theory of Computation
// Has "/": COSC039: Theory of Computation
// Has "/": CRWT022: Intermediate Poetry I
// Has "/": CRWT020: Intermediate Fiction I
// Has "/": CRWT021: Intermediate Creative Non Fiction I
// Has "/": MATH075.01: Applied Topics in Number Theory and Algebra
// Has "/": MATH075.01: Applied Topics in Number Theory and Algebra
// Has "/": MATH074: Algebraic Topology
// Has "/": MATH005.01: Computational Text Analysis for the Social Sciences
// Has Between: ENGS162: Methods in Biotechnology
// Has Between: MUS052.01: Conducting and Artistic Direction
