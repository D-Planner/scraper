/* eslint-disable prefer-destructuring */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import React, { useState } from 'react';
// import async from 'async';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import Majors from '../../majors';
// import checkedIcon from '../../../style/checkboxChecked.svg';
// import uncheckedIcon from '../../../style/checkboxUnchecked.svg';

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

  const fillDistribs = async () => {
    const fixed = [];
    const flexible = [];

    // does initial sort, sorts the list of user courses into [fixed] or [flexible]
    props.userCourses.forEach((userCourse) => {
      userCourse.course.distribs.forEach((distrib) => {
        GenEds[distrib].fulfilled = true;
      });
      if (userCourse.course.distribs.length > 1) {
        flexible.push(userCourse);
      } else if (userCourse.course.distribs.length > 0) {
        userCourse.distrib = userCourse.course.distribs[0];
        fixed.push(userCourse);
      }
    });

    // const counter = 0;

    // async.whilst(
    //   function functionName1(callbackFunction) {
    //     // perform before each execution of iterFunctionInside, you need a condition(or other related condition) in 2nd params.
    //     console.log(`Lengths: ${fixed.length} ${flexible.length}`);
    //     callbackFunction(null, ((flexible.length > 0 || fixed.length > 0) && counter < 10));
    //   },
    //   // this func is called each time when functionName1 invoked
    //   function iterFunctionInside(callback) {
    //     // increase counter to compare with compareVariable
    //     counter += 1;
    //     console.log('iteration', counter);
    //     // for every [fixed] course, simply check off the distrib
    //     Promise.all(
    //       fixed.map((userCourse) => {
    //         return new Promise((resolve) => {
    //           GenEds[userCourse.distrib].fulfilled = true;
    //           resolve();
    //         });
    //       }),
    //     ).then(async () => { // once all [distrib]s have been checked through, clear the [fixed] array
    //       let hitCount = 0;
    //       fixed.length = 0;
    //       for (let i = 0; i < flexible.length; i += 1) {
    //         console.log(`\tflexible iteration ${i}`);
    //         const userCourse = flexible[i];
    //         await Promise.all(
    //           userCourse.course.distribs.map((distrib) => {
    //             console.log('\t\tstarted distrib');
    //             return new Promise((resolve2) => { // each and every one of these promises are not getting executed in order...
    //               console.log(`\t\t\t${distrib}`);
    //               // checks to see if one of the [flexible]'s [distrib]s are already fulfilled; if so, then it should get moved to [fixed]
    //               if (GenEds[distrib].fulfilled) {
    //                 hitCount += 1;
    //                 userCourse.distrib = userCourse.course.distribs[findOtherDistrib(distrib, userCourse.course.distribs)];
    //                 // determines whether the [userCourse] is already in the [fixed] array
    //                 if (fixed.findIndex(e => e.id === userCourse.id) !== -1) {
    //                   fixed.splice(fixed.findIndex(e => e.id === userCourse.id), 1, userCourse);
    //                 } else {
    //                   fixed.push(userCourse);
    //                 }
    //                 flexible.splice(i, 1);
    //                 i -= 1;
    //               }
    //               console.log('\t\tfinished distrib');
    //               resolve2();
    //             });
    //           }),
    //         );
    //         console.log('\tfinished iteration');
    //       }
    //       if (hitCount === 0) {
    //         console.log('there were no hits');
    //         flexible.forEach((userCourse) => {
    //           userCourse.distrib = userCourse.course.distribs[0];
    //           console.log(userCourse.distrib);
    //           GenEds[userCourse.distrib].fulfilled = true;
    //         });
    //       }
    //       callback(null, counter);
    //     });
    //   },
    //   function (err, n) {
    //   },
    // );
  };

  // const findOtherDistrib = (unwantedDistrib, distribs) => {
  //   if (distribs.indexOf(unwantedDistrib) === 1) return 0;
  //   else if (distribs.indexOf(unwantedDistrib) === 0) return 1;
  //   else return null;
  // };

  const renderGenEds = () => {
    fillDistribs();
    return (
      <div className="reqs-list">
        {Object.values(GenEds).map((genEd) => {
          return (
            <div key={genEd.name} className="genEd-row">
              <img className="icon" src={genEd.icon} alt={`${genEd.name} icon`} data-tip data-for={genEd.name} />
              <ReactTooltip id={genEd.name} place="right" type="dark" effect="float">{genEd.fullName}</ReactTooltip>
              {/* <div className="genEd-name">{genEd.fullName}</div> */}
              <div className={genEd.fulfilled ? 'checkbox complete' : 'checkbox'}>{genEd.fulfilled ? 'Complete' : 'Incomplete'}</div>
              {/* <img className="checkbox" src={genEd.fulfilled ? checkedIcon : uncheckedIcon} alt="checkbox" /> */}
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
        <h1 className="pane-title">Your Degree</h1>
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
