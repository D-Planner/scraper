import React from 'react';
import { connect } from 'react-redux';
import DialogWrapper from '../dialogWrapper';

import './courseInfo.scss';

const CourseInfoDialog = (props) => {
  // console.log(props);
  return (
    <DialogWrapper {...props}>
      {courseInfo(props.data, props.nextTerm)}
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

/**
 * Handles rendering of distributive bubbles.
 * THIS FEATURE IS NOT COMPLETE, DEPENDENT ON MAKING [distrib] and [wc] BEINGS ARRAYS
 */
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
      <div className="section-header">Distributives</div>
      <div id="bubbles">
        {distribs.map((distrib) => {
          return (
            <img key={distrib.name} className="distrib-icon" src={distrib.icon} alt={distrib.name} />
          );
        })}
        {(wcs.length === 0 || distribs.length === 0) ? null : <div className="vertical-divider" />}
        {wcs.map((wc) => {
          return (
            <img key={wc.name} className="wc-icon" src={wc.icon} alt={wc.name} />
          );
        })}
      </div>

    </div>
  );
};

/**
 * Handles rendering of medians, cuts off after 5 terms.
 * @param {Array} medians
 */
const renderMedians = (medians) => {
  return (
    <div id="medians">
      <div className="section-header">Medians</div>
      <div id="bubbles">
        {
          medians.slice(0, 5).map((median) => {
            return (
              <div key={median.term} className="median-bubble">
                <div className="median-bubble-grade">{median.courses[0].median}</div>
                <div className="median-bubble-term">{median.term}</div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

/**
 * Handles rendering of scores.
 * @param {*} course
 */
const renderScores = (course) => {
  return (
    <div id="scores">
      <div className="section-header">Scores</div>
      <div>
        Layup-list Score: {course.layuplist_score}
      </div>
    </div>
  );
};

/**
 * Handles rendering of the description.
 * @param {String} description
 */
const renderDescription = (description) => {
  return (
    <div id="description">
      <div className="section-header">Description</div>
      {description}
    </div>
  );
};

/**
 * Handles rendering of information for next term, if offered.
 * THIS FEATURE IS NOT COMPLETE, DEPENDENT ON HAVING A UNIVERSAL TERM ON OUR API SERVER
 * THIS FEATURE IS NOT COMPLETE, DEPENDENT ON FIXING THE [timeslot] PROPERTY.
 * @param {*} course
 * @param {String} nextTerm
 */
const renderNextTerm = (course, nextTerm) => {
  if (nextTerm === course.term) {
    return (
      <div id="next-term">
        <div className="section-header">Offered Next Term</div>
        <div id="offerings">
          <span>{course.timeslot} - hour</span>
          <span>2A - hour</span>
        </div>
      </div>
    );
  } else return null;
};

/**
 * Master handlers for all information about the course.
 * @param {*} course
 * @param {String} nextTerm
 */
const courseInfo = (course, nextTerm) => {
  console.log(course);
  return (
    <div id="content">
      <div id="major">Engineering Department: Prerequisite</div>
      <hr className="horizontal-divider" />
      <div id="first">{renderNextTerm(course, nextTerm)}{renderDescription(course.description)}</div>
      <hr className="horizontal-divider" />
      <div id="metrics">
        {renderDistribs(course)}
        {renderMedians(course.medians)}
        {renderScores(course)}
      </div>
      <hr className="horizontal-divider" />
    </div>
  );
};

const mapStateToProps = state => ({
  nextTerm: state.time.nextTerm,
});

export default connect(mapStateToProps, null)(CourseInfoDialog);
