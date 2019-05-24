import React from 'react';
import DialogWrapper from '../dialogWrapper';

import './courseInfo.scss';

const CourseInfoDialog = (props) => {
  console.log(props);
  return (
    <DialogWrapper {...props}>
      {courseInfo(props.data)}
    </DialogWrapper>
  );
};

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
const icons = importSVGs(require.context('../../style/distrib_icons', false, /\.svg$/));

const distribTypes = [
  {
    fullName: 'Arts',
    name: 'ART',
    icon: icons.art,
    fulfills: false,
  },
  {
    fullName: 'Literature',
    name: 'LIT',

    icon: icons.lit,
    fulfills: false,
  },
  {
    fullName: 'Thought, Meaning, and Value',
    name: 'TMV',
    icon: icons.tmv,
    fulfills: false,
  },
  {
    fullName: 'International or Comparative Study',
    name: 'INT',
    icon: icons.int,
    fulfills: false,
  },
  {
    fullName: 'Social Analysis',
    name: 'SOC',
    icon: icons.soc,
    fulfills: false,
  },
  {
    fullName: 'Quantitative and Deductive Science',
    name: 'QDS',
    icon: icons.qds,
    fulfills: false,
  },
  {
    fullName: 'Natural and Physical Science (LAB)',
    name: 'SLA',
    icon: icons.sla,
    fulfills: false,
  },
  {
    fullName: 'Natural and Physical Science',
    name: 'SCI',
    icon: icons.sci,
    fulfills: false,
  },
  {
    fullName: 'Technology and Applied Science (LAB)',
    name: 'TLA',
    icon: icons.tla,
    fulfills: false,
  },
  {
    fullName: 'Technology and Applied Science',
    name: 'TAS',
    icon: icons.tas,
    fulfills: false,
  },
  {
    fullName: 'Western Cultures',
    name: 'WC',
    icon: icons.wc_w,
    fulfills: false,
  },
  {
    fullName: 'Non-Western Cultures',
    name: 'NW',
    icon: icons.wc_nw,
    fulfills: false,
  },
  {
    fullName: 'Culture and Identity',
    name: 'CI',
    icon: icons.wc_ci,
    fulfills: false,
  },
];

const renderDistribs = (course) => {
  const distribTypesNames = distribTypes.map(distrib => distrib.name);
  const distribs = [];
  const wcs = [];
  if (typeof course.distrib !== 'undefined') {
    course.distrib.split(' ').forEach((distrib) => {
      if (distribTypesNames.includes(distrib)) {
        distribs.push(distribTypes.find(ref => ref.name === distrib));
      }
    });
  }
  if (typeof course.wc !== 'undefined') {
    course.wc.split(' ').forEach((wc) => {
      if (distribTypesNames.includes(wc)) {
        wcs.push(distribTypes.find(ref => ref.name === wc));
      }
    });
  }
  return (
    <div id="distribs">
      {distribs.map((distrib) => {
        return (
          <img className="icon" src={distrib.icon} alt={distrib.name} />
        );
      })}
    </div>
  );
};

const courseInfo = (course) => {
  return (
    <div id="content">
      <div id="major">Engineering Department: Prerequisite</div>
      <hr className="divider" />
      <div id="description">{course.description}</div>
      <div id="current-term">
        Latest Term:
        {' '}
        {course.term}
      </div>
      <div id="metrics">
        {renderDistribs(course)}
        <div id="medians">
          hi
        </div>
        <div id="scores">
          {course.layuplist_score}
        </div>
      </div>

    </div>
  );
};

export default CourseInfoDialog;
