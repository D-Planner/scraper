// Self URL for the React application
export const APP_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'http://d-planner.com';
export const ROOT_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090' : 'https://d-planner-api.herokuapp.com';

// Item type definition for ReactDND
// Lists types of possible draggable items
export const ItemTypes = {
  COURSE: 'COURSE',
};

export const BUG_REPORT_URL = 'https://forms.gle/u1AYzJsogsP2YPZG6';

// Type definitions for different types of dialogs
export const DialogTypes = {
  NEW_PLAN: 'NEW_PLAN',
  DELETE_PLAN: 'DELETE_PLAN',
  DECLARE_MAJOR: 'DECLARE_MAJOR',
  COURSE_INFO: 'COURSE_INFO',
  OFF_TERM: 'OFF_TERM',
  PROFILE: 'PROFILE',
  ERROR: 'ERROR',
  FILTER: 'FILTER',
  NOTICE: 'NOTICE',
  INTEREST_PROFILE: 'INTEREST_PROFILE',
};

export const Departments = [
  'AMES',
  'CRWT',
  'AAAS',
  'WRIT',
  'AMEL',
  'CHIN',
  'CHEM',
  'COLT',
  'COGS',
  'EARS',
  'COSC',
  'LATS',
  'ASCL',
  'CLST',
  'GOVT',
  'GRK',
  'LING',
  'HEBR',
  'ASTR',
  'ECON',
  'COCO',
  'MATH',
  'HIST',
  'EDUC',
  'BIOL',
  'ANTH',
  'HUM',
  'MES',
  'ENGL',
  'INTS',
  'FREN',
  'REL',
  'RUSS',
  'ARTH',
  'ITAL',
  'FRIT',
  'ENGS',
  'LACS',
  'MUS',
  'SART',
  'JWST',
  'LAT',
  'GEOG',
  'ENVS',
  'SOCY',
  'JAPN',
  'FILM',
  'GERM',
  'NAS',
  'TUCK',
  'THEA',
  'SPAN',
  'PHYS',
  'SPEE',
  'PORT',
  'PSYC',
  'PBPL',
  'QSS',
  'ARAB',
  'PHIL',
  'WGSS',
];

const departmentsWithFullNameData = [
  {
    code: 'AMES',
    name: 'Asian and Middle Eastern Studies',
    courses: 89,
  },
  {
    code: 'CRWT',
    name: '',
    courses: 21,
  },
  {
    code: 'AAAS',
    name: 'African and African American Studies',
    courses: 124,
  },
  {
    code: 'WRIT',
    name: 'Writing Courses',
    courses: 38,
  },
  {
    code: 'AMEL',
    name: 'Asian and Middle Eastern Languages and Literatures',
    courses: 7,
  },
  {
    code: 'CHIN',
    name: 'Chinese',
    courses: 38,
  },
  {
    code: 'CHEM',
    name: 'Chemistry',
    courses: 32,
  },
  {
    code: 'COLT',
    name: 'Comparative Literature',
    courses: 135,
  },
  {
    code: 'COGS',
    name: 'Cognitive Science',
    courses: 14,
  },
  {
    code: 'EARS',
    name: 'Earth Sciences',
    courses: 53,
  },
  {
    code: 'COSC',
    name: 'Computer Science',
    courses: 94,
  },
  {
    code: 'LATS',
    name: 'Latino Studies',
    courses: 24,
  },
  {
    code: 'ASCL',
    name: '',
    courses: 76,
  },
  {
    code: 'CLST',
    name: 'Classical Studies',
    courses: 53,
  },
  {
    code: 'GOVT',
    name: 'Government',
    courses: 236,
  },
  {
    code: 'GRK',
    name: 'Greek',
    courses: 20,
  },
  {
    code: 'LING',
    name: 'Linguistics',
    courses: 45,
  },
  {
    code: 'HEBR',
    name: 'Hebrew',
    courses: 18,
  },
  {
    code: 'ASTR',
    name: 'Astronomy',
    courses: 13,
  },
  {
    code: 'ECON',
    name: 'Economics',
    courses: 44,
  },
  {
    code: 'COCO',
    name: 'College Courses',
    courses: 21,
  },
  {
    code: 'MATH',
    name: 'Mathematics',
    courses: 63,
  },
  {
    code: 'HIST',
    name: 'History',
    courses: 201,
  },
  {
    code: 'EDUC',
    name: 'Education',
    courses: 36,
  },
  {
    code: 'BIOL',
    name: 'Biological Sciences',
    courses: 80,
  },
  {
    code: 'ANTH',
    name: 'Anthropology',
    courses: 118,
  },
  {
    code: 'HUM',
    name: 'Humanities',
    courses: 6,
  },
  {
    code: 'MES',
    name: '',
    courses: 44,
  },
  {
    code: 'ENGL',
    name: 'English',
    courses: 220,
  },
  {
    code: 'INTS',
    name: 'International Studies',
    courses: 16,
  },
  {
    code: 'FREN',
    name: 'French',
    courses: 82,
  },
  {
    code: 'REL',
    name: 'Religion',
    courses: 162,
  },
  {
    code: 'RUSS',
    name: 'Russian Language and Literature',
    courses: 46,
  },
  {
    code: 'ARTH',
    name: 'Art History',
    courses: 173,
  },
  {
    code: 'ITAL',
    name: 'Italian',
    courses: 33,
  },
  {
    code: 'FRIT',
    name: 'French and Italian in Translation',
    courses: 15,
  },
  {
    code: 'ENGS',
    name: 'Engineering Sciences',
    courses: 80,
  },
  {
    code: 'LACS',
    name: 'Latin American and Caribbean Studies',
    courses: 51,
  },
  {
    code: 'MUS',
    name: 'Music',
    courses: 137,
  },
  {
    code: 'SART',
    name: 'Studio Art',
    courses: 41,
  },
  {
    code: 'JWST',
    name: 'Jewish Studies',
    courses: 71,
  },
  {
    code: 'LAT',
    name: 'Latin',
    courses: 22,
  },
  {
    code: 'GEOG',
    name: 'Geography',
    courses: 77,
  },
  {
    code: 'ENVS',
    name: 'Environmental Studies',
    courses: 49,
  },
  {
    code: 'SOCY',
    name: 'Sociology',
    courses: 79,
  },
  {
    code: 'JAPN',
    name: 'Japanese',
    courses: 25,
  },
  {
    code: 'FILM',
    name: 'Film and Media Studies',
    courses: 96,
  },
  {
    code: 'GERM',
    name: 'German Studies',
    courses: 59,
  },
  {
    code: 'NAS',
    name: 'Native American Studies',
    courses: 56,
  },
  {
    code: 'TUCK',
    name: 'Tuck Undergraduate Courses',
    courses: 3,
  },
  {
    code: 'THEA',
    name: 'Theater',
    courses: 59,
  },
  {
    code: 'SPAN',
    name: 'Spanish',
    courses: 100,
  },
  {
    code: 'PHYS',
    name: 'Physics',
    courses: 43,
  },
  {
    code: 'SPEE',
    name: 'Speech',
    courses: 16,
  },
  {
    code: 'PORT',
    name: 'Portuguese',
    courses: 24,
  },
  {
    code: 'PSYC',
    name: 'Psychological and Brain Sciences',
    courses: 99,
  },
  {
    code: 'PBPL',
    name: 'Public Policy',
    courses: 34,
  },
  {
    code: 'QSS',
    name: 'Quantitative Social Science',
    courses: 25,
  },
  {
    code: 'ARAB',
    name: 'Arabic',
    courses: 43,
  },
  {
    code: 'PHIL',
    name: 'Philosophy',
    courses: 123,
  },
  {
    code: 'WGSS',
    name: 'Women\'s, Gender, and Sexuality Studies',
    courses: 118,
  },
];

export const departmentsWithFullName = departmentsWithFullNameData.reduce((acc, curr) => {
  acc[curr.code] = curr.name;
  return acc;
}, {});

// import all svgs in from require.context, found later
const importSVGs = (r) => {
  const icons = {};
  r.keys().forEach((item) => {
    // strip extension and ./ at beginning of file
    const itemName = item.replace('./', '').replace('.svg', '');

    // require the icon and insert its reference into the icons dictionary
    icons[itemName] = r(item);
  });
  return icons;
};

// import all svg files in the ../style/distrib_icons directory
const icons = importSVGs(require.context('../style/distrib_icons', false, /\.svg$/));

// Validates email addresses against regex
// eslint-disable-next-line no-useless-escape
export const emailCheckRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const GenEdsForDisplay = {
  ART: {
    fullName: 'Arts',
    name: 'ART',
    icon: icons.art,
  },
  LIT: {
    fullName: 'Literature',
    name: 'LIT',
    icon: icons.lit,
  },
  TMV: {
    fullName: 'Thought, Meaning, and Value',
    name: 'TMV',
    icon: icons.tmv,
  },
  INT: {
    fullName: 'International or Comparative Study',
    name: 'INT',
    icon: icons.int,
  },
  SOC: {
    fullName: 'Social Analysis',
    name: 'SOC',
    icon: icons.soc,
  },
  QDS: {
    fullName: 'Quantitative and Deductive Science',
    name: 'QDS',
    icon: icons.qds,
  },
  SLA: {
    fullName: 'Natural and Physical Science',
    name: 'SLA',
    icon: icons.sla,
  },
  SCI: {
    fullName: 'Natural and Physical Science',
    name: 'SCI',
    icon: icons.sci,
  },
  TLA: {
    fullName: 'Technology and Applied Science (LAB)',
    name: 'TLA',
    icon: icons.tla,
  },
  TAS: {
    fullName: 'Technology or Applied Science',
    name: 'TAS',
    icon: icons.tas,
  },
  W: {
    fullName: 'Western Cultures',
    name: 'W',
    icon: icons.w,
  },
  NW: {
    fullName: 'Non-Western Cultures',
    name: 'NW',
    icon: icons.nw,
  },
  CI: {
    fullName: 'Culture and Identity',
    name: 'CI',
    icon: icons.ci,
  },
};

export const GenEds = {
  ART: {
    fullName: 'Arts',
    name: 'ART',
    icon: icons.art,
    fulfilled: false,
    count: 1,
    filled: 0,
  },
  LIT: {
    fullName: 'Literature',
    name: 'LIT',
    icon: icons.lit,
    fulfilled: false,
    count: 1,
    filled: 0,
  },
  TMV: {
    fullName: 'Thought, Meaning, and Value',
    name: 'TMV',
    icon: icons.tmv,
    fulfilled: false,
    count: 1,
    filled: 0,
  },
  INT: {
    fullName: 'International or Comparative Study',
    name: 'INT',
    icon: icons.int,
    fulfilled: false,
    count: 1,
    filled: 0,
  },
  SOC: {
    fullName: 'Social Analysis',
    name: 'SOC',
    icon: icons.soc,
    fulfilled: false,
    count: 2,
    filled: 0,
  },
  QDS: {
    fullName: 'Quantitative and Deductive Science',
    name: 'QDS',
    icon: icons.qds,
    fulfilled: false,
    count: 1,
    filled: 0,
  },
  'SLA/SCI': {
    fullName: 'Natural and Physical Science',
    name: 'SLA/SCI',
    icon: icons.sci_sla,
    fulfilled: false,
    count: 2,
    filled: 0,
  },
  TLA: {
    fullName: 'Technology and Applied Science (LAB)',
    name: 'TLA',
    icon: icons.tla,
    fulfilled: false,
    count: 1,
    filled: 0,
  },
  'TLA/TAS': {
    fullName: 'Technology or Applied Science',
    name: 'TLA/TAS',
    icon: icons.tas_tla,
    fulfilled: false,
    count: 1,
    filled: 0,
  },
  W: {
    fullName: 'Western Cultures',
    name: 'W',
    icon: icons.w,
    fulfilled: false,
    count: 1,
    filled: 0,
  },
  NW: {
    fullName: 'Non-Western Cultures',
    name: 'NW',
    icon: icons.nw,
    fulfilled: false,
    count: 1,
    filled: 0,
  },
  CI: {
    fullName: 'Culture and Identity',
    name: 'CI',
    icon: icons.ci,
    fulfilled: false,
    count: 1,
    filled: 0,
  },
};

/**
 * Controls all logging in D-Planner frontend application.
 * @param {String} source Name of the originating component, in camel case.
 * @param {String} message Message.
 * @param  {...any} objects Set of objects to be logged in addition to the message.
 */
export const consoleLogging = (source, message, ...objects) => {
  const config = {
    DraggableUserCourse: true,
    DPlan: false,
    RequirementsPane: false,
    Term: false,
  };
  switch (source) {
    case 'DraggableUserCourse':
      if (config.DraggableUserCourse) console.log(message, ...objects);
      break;
    case 'DPlan':
      if (config.DPlan) console.log(message, ...objects);
      break;
    case 'RequirementsPane':
      if (config.RequirementsPane) console.log(message, ...objects);
      break;
    case 'Term':
      if (config.Term) console.log(message, ...objects);
      break;
    default:
      break;
  }
};
