import React, { useState } from 'react';
import classNames from 'classnames';
import Majors from '../../majors';
import checkedIcon from '../../../style/checkboxChecked.svg';
import uncheckedIcon from '../../../style/checkboxUnchecked.svg';

import './requirementsPane.scss';
import { GenEds } from '../../../constants';

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

    let counter = 0;

    while ((flexible.length > 0 || fixed.length > 0) && counter < 10) {
      counter += 1;
      // for every [rank1] course, simply check off the distrib
      Promise.all(
        fixed.map((userCourse) => {
          return new Promise((resolve) => {
            GenEds[userCourse.distrib].fulfilled = true;
            resolve();
          });
        }),
      ).then(() => { // once all [distrib]s have been checked through, clear the [fixed] array
        fixed.length = 0;
        for (let i = 0; i < flexible.length; i += 1) {
          const userCourse = flexible[i];
          userCourse.course.distribs.forEach((distrib) => {
            // checks to see if one of the [flexible]'s [distrib]s are already fulfilled; if so, then it should get moved to [fixed]
            if (GenEds[distrib].fulfilled) {
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
    }
  };

  const findOtherDistrib = (unwantedDistrib, distribs) => {
    if (distribs.indexOf(unwantedDistrib) === 1) return 0;
    else if (distribs.indexOf(unwantedDistrib) === 0) return 1;
    else return null;
  };

  const renderGenEds = () => {
    fillDistribs();
    return (
      <div className="reqs-list">
        {Object.values(GenEds).map((genEd) => {
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
