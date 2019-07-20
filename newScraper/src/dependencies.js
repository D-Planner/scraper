import cheerio from 'cheerio';
import request from 'sync-request';
import fs from 'fs';
import courses from '../../spider/data/courses.json';
import departmentsJson from '../../spider/data/departments.json';
// import parsedReqs from '../data/prerequisites2.json';
// import parsedReqs2 from '../data/prerequisites2_0.json';
import prereqs from '../data/prerequisites.json';

const departmentCodes = departmentsJson.departments.map((dep) => {
  return dep.code;
})


// Loop over all courses
let allPrerequisites = {};
for (let course of courses) {
  // For each individual course
  let prerequisites = [];
  // if (course.title in parsedReqs) {
  //   prerequisites = parsedReqs[course.title];
  // } else if (course.title in parsedReqs2) {
  //   prerequisites = parsedReqs2[course.title];
  // } else
  if (course.orc_url) {
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
      if (preReqText.length > 1) {
        let courseMatches = preReqText.replace(/\w{3,4}(\s|\-)\d{1,3}/g, (x) => {
          return (x + "$%&");
        }).split('$%&').filter((x) => {
          return (x.match(/\d/) && !x.match(/\d{1,3}(F|W|S|X)/) && !x.includes(':') && !x.includes('Timetable of Class Meetings') && !x.includes('offered'));
        });

        switch (preReqText) {
          case "LING 1 and one other Linguistics course in the 20s.":
            prerequisites = [
                {
                  "req": [
                    "LING 021"
                  ]
                },
                {
                  "range": [
                    "LING 020",
                    "LING 029"
                  ]
                }
              ];

          default:

        }

        if (courseMatches.length > 0) {
          let currIdx = 0;
          let currKey = '';
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
            let trimmed = currMatch.match(/(\w{3,4})?(\s|\-)\d{1,3}/)[0].replace('-',' ').trim().toUpperCase();

            const tokens = trimmed.split(' ');
            if(!(new RegExp(departmentCodes.join('|')).test(trimmed))) {
              if (tokens.length === 1) tokens.unshift(course.department);
              else tokens[0] = course.department;
              console.log("Fixed Dept: " + course.title);
            }
            //Zero Padding
            trimmed = tokens[0] + ' ' + ('00' + tokens[1]).slice(-3);

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
            if (currKey !== '' && !prerequisites[currIdx][currKey].includes(trimmed)) prerequisites[currIdx][currKey].push(trimmed);


            // The Delay
            if ((currMatch.includes("one of") || currMatch.includes("and")) && delay) {
              currIdx++;
              delay = false;
            }
            if (currMatch.includes('between') || currMatch.includes('from')) delay = true;
          }

        }
      }
    } catch (e) {
      console.log(e);
      console.log("Issue Parsing: " + course.orc_url);
    }
  }
  allPrerequisites[course.title] = prerequisites;
};

fs.writeFile('data/prerequisites3.json', JSON.stringify(allPrerequisites), (e) => {
  if (e) throw e;
  console.log("Saved");
  return;
});

// Courses that need checking / Fixing


// Has "/": CRWT022: Intermediate Poetry I done
// Has "/": CRWT021: Intermediate Creative Non Fiction I done
// Has "/": CRWT020: Intermediate Fiction I done
// Has Grade: CHEM057: Honors Organic Chemistry done
// Has "/": EARS077: Environmental Applications of GIS done
// Fixed Dept: EARS034: Earth’s Biogeochemical Cycles done
// Has Between: EARS037: Marine Geology done
// Has Between: EARS040: Materials of the Earth done
// Fixed Dept: EARS091: Science Communication done
// Has Between: EARS065: Remote Sensing done
// Fixed Dept: EARS119: Stable Isotope Geochemistry done
// Fixed Dept: EARS058: Stratigraphy and Sedimentary Petrology done
// Has Between: EARS038: Introduction to Sedimentary Systems done
// Has Grade: COSC258: Advanced Operating Systems done
// Has "/": COSC039: Theory of Computation done
// Has Grade: COSC231: Advanced Algorithms done
// Fixed Dept: COSC077: Computer Graphics done
// Fixed Dept: LING008: The Structure of Maori done
// Fixed Dept: LING035: Field Methods done
// Fixed Dept: LING054: Foreign Study in Linguistics done
// Has Between: ECON081: Advanced Topics in Microeconomics done
// Fixed Dept: ECON087: Senior Thesis done
// Has "/": COCO021: What's in Your Shoebox? Unpacking Your Study Abroad Experience done
// Issue Parsing: http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate/College-Courses/COCO-College-Courses/COCO-21
// Has "/": MATH005.01: Computational Text Analysis for the Social Sciences done
// Has "/": MATH075.01: Applied Topics in Number Theory and Algebra done
// Fixed Dept: MATH096: Mathematical Finance II done
// Has "/": MATH074: Algebraic Topology done
// Fixed Dept: BIOL095: Independent Research in Biology I done
// Fixed Dept: BIOL070: Biologic Lessons of the Eye done
// Has Between: BIOL025: Introductory Marine Biology and Ecology done
// Fixed Dept: BIOL097: Honors Research in Biology done
// Fixed Dept: BIOL029: Biostatistics done
// Has Between: BIOL069: Cell Signaling done
// Has Between: BIOL076: Advanced Genetics done
// Has Between: BIOL031: Physiological Ecology done
// Has Between: BIOL048: Disease, The Environment, and Human History done
// Fixed Dept: BIOL129: Biostatistics III: Generalized Linear Mixed Models done
// Has Between: BIOL051: Advanced Population Ecology done
// Has Between: BIOL063: RNA: The Real Secret of Life done
// Has Between: BIOL023: Social Evolution: Cooperation and Construction Among Animal Architects done
// Has Between: BIOL067: The Biology of Fungi and Parasites that Cause Disease done
// Has Between: BIOL028: Macroevolution done
// Has Between: BIOL066: Molecular Basis of Cancer done
// Has Between: BIOL049: Cellular and Molecular Neuroscience done
// Has Between: BIOL071: Current Topics in Cell Biology
// Fixed Dept: BIOL060.02: Evolution of Sex done
// Has Between: BIOL032: Animal Communication done
// Fixed Dept: ENGL086: Senior Workshop in Creative Writing done
// Fixed Dept: FREN055.05: France, 1914-1944: from One War to Another done
// Fixed Dept: FREN003: Introductory French III done
// Fixed Dept: FREN010.03: Invitation au Voyage done
// Fixed Dept: FREN010: Introduction to French Literature: Masterworks and Great Issues done
// Fixed Dept: FREN010.12: The Other's Gaze done
// Fixed Dept: FREN010.02: The Heroic Heart done
// Fixed Dept: FREN010.13: Games People Play done
// Fixed Dept: FREN045.05: Between Revolution and Oblivion: The Politics of Literature in Nineteenth-Century France done
// Fixed Dept: FREN010.11: On Monsters and Monstrosity done
// Fixed Dept: FREN010.16: The Feeling of Love done
// Fixed Dept: FREN010.20: Representations of war in French literature and film from the Middle Ages to the present done
// Fixed Dept: FREN010.15: Literature and Images done
// Fixed Dept: FREN010.10: Du mal/On Evil done
// Fixed Dept: FREN070.05: Mystical and Earthly Love done
// Fixed Dept: FREN053.08: Paris, philosophies de l'espace done
// Fixed Dept: FREN045.04: What is the Contemporary? done
// Fixed Dept: FREN010.14: Le sentiment amoureux done
// Fixed Dept: FREN010.19: A La Recherche du bonheur done
// Fixed Dept: FREN020.02: The Locations of French Culture
// Fixed Dept: FREN075.02: Toward a History of French Cinema done
// Fixed Dept: FREN080.03: Men Behaving Badly: The Offending Sex in Literature and Music done
// Fixed Dept: FREN010.06: The Anatomy of Passion done
// Fixed Dept: FREN010.08: Living in Paris/Habiter Paris done
// Fixed Dept: RUSS071: Advanced Seminar in Russian Culture done
// Fixed Dept: RUSS045: Special Topics in Russian Language done
// Fixed Dept: ITAL021: Early Italian Literature and Culture done
// Fixed Dept: ITAL010.06: The Culture of Food in Italian Literature, 1300-2013 done
// Fixed Dept: ITAL010.03: Italian Disaster Narratives done
// Fixed Dept: ITAL010.04: Divas in Italian Culture done
// Fixed Dept: ITAL010.05: L'invenzione del paesaggio: Spaces and Places in Italian Culture done
// Fixed Dept: ITAL027.01: Animals and Animality in Modern Italian Literature and Thought done
// Fixed Dept: ITAL027.02: Culture and/in Translation: Theory and Practice done
// Fixed Dept: ENGS100: Methods in Applied Mathematics I done
// Fixed Dept: ENGS116: Computer Engineering: Computer Architecture done
// Fixed Dept: ENGS106: Numerical Linear Algebra done
// Fixed Dept: ENGS250: Turbulence in Fluids done
// Fixed Dept: ENGS104: Optimization Methods for Engineering Applications done
// Fixed Dept: ENGS114: Networked Multi-Agent Systems done
// Fixed Dept: ENGS089: Engineering Design Methodology and Project Initiation done ~~~~~FLAG
// Fixed Dept: ENGS202: Nonlinear Systems done
// Fixed Dept: ENGS124: Optical Devices and Systems
// Has Between: ENGS162: Methods in Biotechnology done
// Fixed Dept: ENGS154: Aircraft Design done
// Fixed Dept: ENGS164: Cellular and Molecular Biomechanics done
// Fixed Dept: ENGS200: Methods in Applied Mathematics II done
// Fixed Dept: ENGS115: Parallel Computing done
// Fixed Dept: ENGS122: Semiconductor Theory and Devices done
// Fixed Dept: ENGS220: Electromagnetic Wave Theory done
// Has Between: MUS052.01: Conducting and Artistic Direction done
// Has Between: GEOG051: Remote Sensing done
// Fixed Dept: GEOG082: Independent Study in the Czech Republic done
// Has Between: GEOG047: The Czech Republic in the New Europe done
// Fixed Dept: GEOG081: Field Research in the Czech Republic done
// Has "/": GEOG059: Environmental Applications of GIS done
// Fixed Dept: ENVS070: Environmental Policy Research Workshop done
// Fixed Dept: NAS019: Encountering Forests done
// Fixed Dept: THEA061: Classical Performance II done
// Fixed Dept: THEA062: Plays in Performance-Perception and Analysis done
// Fixed Dept: THEA060: Classical Performance I done
// Fixed Dept: SPAN009: Culture and Conversation: Advanced Spanish Language done
// Fixed Dept: SPAN020: Writing and Reading: A Critical and Cultural Approach done
