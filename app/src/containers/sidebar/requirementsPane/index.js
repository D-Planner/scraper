import React, { useState } from 'react';
import classNames from 'classnames';
import Majors from '../../majors';
import checkedIcon from '../../../style/checkboxChecked.svg';
import uncheckedIcon from '../../../style/checkboxUnchecked.svg';

import './requirementsPane.scss';

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
const icons = importSVGs(require.context('../../../style/distrib_icons', false, /\.svg$/));

/**
 * @name RequirementsPane
 * @description displays information on a user's distributive and major reqirements for a plan to check progress
 */
const RequirementsPane = (props) => {
  const [distribsActive, setDistribsActive] = useState(true);

  const distribsButtonClass = classNames({
    distribs: true,
    toggle: true,
    active: distribsActive,
  });
  const majorButtonClass = classNames({
    major: true,
    toggle: true,
    active: !distribsActive,
  });

  const setDistribsTabActive = (flag) => {
    setDistribsActive(flag);
  };

  const fillDistribs = () => {
    const fixed = [];
    const flexible = [];
    // does initial sort, sorts the list of user courses into [fixed] or [flexible]
    props.userCourses.forEach((userCourse) => {
      if (userCourse.course.distribs.length > 1) {
        flexible.push(userCourse);
      } else if (userCourse.course.distribs.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        userCourse.distrib = userCourse.course.distribs[0];
        fixed.push(userCourse);
      }
    });

    console.log(fixed);
    console.log(flexible);

    let counter = 0;

    while ((flexible.length > 0 || fixed.length > 0) && counter < 10) {
      console.log('1');
      counter += 1;
      // for every [rank1] course, simply check off the distrib
      Promise.all(
        fixed.map((userCourse) => {
          return new Promise((resolve) => {
            genEdsReference[userCourse.distrib].fulfilled = true;
            resolve();
          });
        }),
      ).then(() => { // once all [distrib]s have been checked through, clear the [fixed] array
        console.log('2');
        fixed.length = 0;
        for (let i = 0; i < flexible.length; i += 1) {
          const userCourse = flexible[i];
          userCourse.course.distribs.forEach((distrib) => {
            // checks to see if one of the [flexible]'s [distrib]s are already fulfilled; if so, then it should get moved to [fixed]
            if (genEdsReference[distrib].fulfilled) {
              userCourse.distrib = userCourse.course.distribs[findOtherDistrib(distrib, userCourse.course.distribs)];
              // determines whether the [userCourse] is already in the [fixed] array
              if (fixed.findIndex(e => e.id === userCourse.id) !== -1) {
                fixed.splice(fixed.findIndex(e => e.id === userCourse.id), 1, userCourse);
              } else {
                fixed.push(userCourse);
              }
              flexible.splice(i, 1);
              i -= 1;
            }
          });
        }
      });
      console.log('3');
    }
  };

  const findOtherDistrib = (unwantedDistrib, distribs) => {
    if (distribs.indexOf(unwantedDistrib) === 1) return 0;
    else if (distribs.indexOf(unwantedDistrib) === 0) return 1;
    else return null;
  };

  const genEdsReference = {
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

  const renderGenEds = () => {
    fillDistribs();
    return (
      <div className="reqs-list">
        {Object.values(genEdsReference).map((genEd) => {
          return (
            <div key={genEd.name} className="genEd-row">
              <img className="icon" src={genEd.icon} alt={`${genEd.name} icon`} />
              <div className="genEd-name">{genEd.name}</div>
              <img className="checkbox" src={genEd.fulfilled ? checkedIcon : uncheckedIcon} alt="checkbox" />
            </div>
          );
        })}
      </div>
    );
  };

  const renderMajorReqs = () => {
    if (props.majors.length > 0) {
      return (
        <div className="reqs-list">
          {props.majors.map((major) => {
            console.log(major);
            return (
              <div className="major" id={major.id}>
                <div className="major-header">
                  {major.name}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return <Majors />;
      // return (
      //   <div className="no-major">
      //     <p>You are not enrolled in a major.</p>
      //     <button type="button" className="enroll-button" onClick={props.showDeclareDialog}>
      //       <p>Choose A Major</p>
      //     </button>
      //   </div>
      // );
    }
  };

  const paneClass = classNames({
    requirements: true,
    pane: true,
    active: props.active,
  });

  return (
    <div className={paneClass} onClick={props.activate} role="presentation">
      <div className="pane-header">
        <h1 className="pane-title">Requirements</h1>
        {props.active
          ? (
            <div className="requirements-toggle">
              <button type="button" className={distribsButtonClass} onClick={() => setDistribsTabActive(true)}>Distribs</button>
              <button type="button" className={majorButtonClass} onClick={() => setDistribsTabActive(false)}>Major</button>
            </div>
          )
          : <div /> }
      </div>
      {distribsActive ? renderGenEds() : renderMajorReqs()}
    </div>
  );
};

export default RequirementsPane;
