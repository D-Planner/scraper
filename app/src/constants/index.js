// Item type definition for ReactDND
// Lists types of possible draggable items
export const ItemTypes = {
  COURSE: 'COURSE',
};

// Type definitions for different types of dialogs
export const DialogTypes = {
  NEW_PLAN: 'NEW_PLAN',
  DELETE_PLAN: 'DELETE_PLAN',
  DECLARE_MAJOR: 'DECLARE_MAJOR',
  COURSE_INFO: 'COURSE_INFO',
  OFF_TERM: 'OFF_TERM',
  PROFILE: 'PROFILE',
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

export const GenEds = {
  ART: {
    fullName: 'Arts',
    name: 'ART',
    icon: icons.art,
    fulfilled: false,
  },
  LIT: {
    fullName: 'Literature',
    name: 'LIT',
    icon: icons.lit,
    fulfilled: true,
  },
  TMV: {
    fullName: 'Thought, Meaning, and Value',
    name: 'TMV',
    icon: icons.tmv,
    fulfilled: false,
  },
  INT: {
    fullName: 'International or Comparative Study',
    name: 'INT',
    icon: icons.int,
    fulfilled: false,
  },
  SOC: {
    fullName: 'Social Analysis',
    name: 'SOC',
    icon: icons.soc,
    fulfilled: false,
  },
  QDS: {
    fullName: 'Quantitative and Deductive Science',
    name: 'QDS',
    icon: icons.qds,
    fulfilled: false,
  },
  SLA: {
    fullName: 'Natural and Physical Science (LAB)',
    name: 'SLA',
    icon: icons.sla,
    fulfilled: false,
  },
  SCI: {
    fullName: 'Natural and Physical Science',
    name: 'SCI',
    icon: icons.sci,
    fulfilled: false,
  },
  TLA: {
    fullName: 'Technology and Applied Science (LAB)',
    name: 'TLA',
    icon: icons.tla,
    fulfilled: false,
  },
  TAS: {
    fullName: 'Technology and Applied Science',
    name: 'TAS',
    icon: icons.tas,
    fulfilled: false,
  },
  W: {
    fullName: 'Western Cultures',
    name: 'W',
    icon: icons.wc_w,
    fulfilled: false,
  },
  NW: {
    fullName: 'Non-Western Cultures',
    name: 'NW',
    icon: icons.wc_nw,
    fulfilled: false,
  },
  CI: {
    fullName: 'Culture and Identity',
    name: 'CI',
    icon: icons.wc_ci,
    fulfilled: false,
  },
};
