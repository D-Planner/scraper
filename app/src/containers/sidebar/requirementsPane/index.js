/* eslint-disable prefer-destructuring */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import React, { Component } from 'react';
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

class RequirementsPane extends Component {
  constructor(props) {
    super(props);

    this.nonPlaceholders = Object.assign([], this.props.userCourses.filter(userCourse => !(userCourse.placeholder)));

    this.fillAll();


    this.state = {
      distribsAction: true,
    };
  }


  componentDidUpdate(prevProps) {
    if (prevProps.userCourses && this.props.userCourses && prevProps.userCourses.length !== this.props.userCourses.length) {
      // Reset the removed ones
      this.nonPlaceholders.forEach((userCourse) => {
        if (!this.props.userCourses.map(uC => uC._id).includes(userCourse._id)) {
          if (userCourse.distrib) {
            GenEds[userCourse.distrib].filled -= 1;
            GenEds[userCourse.distrib].fulfilled = false;
          } if (userCourse.wc) {
            GenEds[userCourse.wc].filled -= 1;
            GenEds[userCourse.wc].fulfilled = false;
          }
        }
      });
      // Add the new ones.
      this.nonPlaceholders = this.props.userCourses.map((userCourse) => {
        if (this.nonPlaceholders.map(uC => uC._id).includes(userCourse._id)) return this.nonPlaceholders.find(e => e._id === userCourse._id);
        return userCourse;
      });
      this.fillAll();
    }
  }

  fillAll = () => {
    const wcs = {
      used: [],
      open: Object.assign([], this.nonPlaceholders.filter(userCourse => (!userCourse.wc))),
    };
    const distribs = {
      used: [],
      open: Object.assign([], this.nonPlaceholders.filter(userCourse => (!userCourse.distrib))),
    };

    this.fillDistribs(wcs, distribs);
  }

  fillDistribs = (wcs, distribs) => {
    const fixDistrib = (distrib) => {
      if (distrib === 'SCI' || distrib === 'SLA') return 'SLA/SCI';
      if (distrib === 'TLA') {
        if (GenEds.TLA.fulfilled) return 'TLA/TAS';
        return distrib;
      } if (distrib === 'TAS') return 'TLA/TAS';
      return distrib;
    };

    let previousFlex = 0;
    let nextFlex = wcs.open.length + distribs.open.length;
    while (previousFlex !== nextFlex) {
      previousFlex = nextFlex;
      let i = 0;
      while (i < wcs.open.length) {
        const userCourse = wcs.open[i];
        const unFulfilled = Object.values(GenEds).filter(genEd => (!genEd.fulfilled)).map(genEd => genEd.name);
        const unFulfilledWCs = userCourse.course.wcs.filter((wc) => {
          return unFulfilled.includes(wc);
        });
        if (unFulfilledWCs.length === 1) {
          const wc = unFulfilledWCs[0];
          userCourse.wc = wc;
          GenEds[wc].filled += 1;
          wcs.used.push(userCourse);
          GenEds[wc].course = GenEds[wc].course ? [...GenEds[wc].course, userCourse.course.name] : [userCourse.course.name];
          if (GenEds[wc].filled === GenEds[wc].count) GenEds[wc].fulfilled = true;
          // console.log(userCourse.course.name, 'Using this course for', wc, userCourse.course.wcs);
        } else if (unFulfilledWCs.length === 0) {
          wcs.open.splice(i, 1);
          // console.log(userCourse.course.name, 'Is no longer being used', userCourse.course.wcs);
        } else {
          // console.log('ERROR', userCourse.course.name, unFulfilledWCs.length);
          i += 1;
        }
      }
      let j = 0;
      while (j < distribs.open.length) {
        const userCourse = distribs.open[j];
        const unFulfilled = Object.values(GenEds).filter(genEd => (!genEd.fulfilled)).map(genEd => genEd.name);
        const unFulfilledDistribs = userCourse.course.distribs.filter((distrib) => {
          return unFulfilled.includes(fixDistrib(distrib));
        });
        if (unFulfilledDistribs.length === 1) {
          const distrib = fixDistrib(unFulfilledDistribs[0]);

          userCourse.distrib = distrib;

          GenEds[distrib].filled += 1;
          GenEds[distrib].course = GenEds[distrib].course ? [...GenEds[distrib].course, userCourse.course.name] : [userCourse.course.name];
          distribs.used.push(userCourse);
          if (GenEds[distrib].filled === GenEds[distrib].count) {
            GenEds[distrib].fulfilled = true;
          }
          distribs.open.splice(j, 1);
          console.log(userCourse.course.name, 'Is no longer being used for ', distrib);
        } else if (unFulfilledDistribs.length === 0) {
          console.log(userCourse.course.name, 'Is no longer being used', userCourse.course.distribs);
          distribs.open.splice(j, 1);
        } else {
          j += 1;
          console.log(userCourse.course.name, 'ERROR', unFulfilledDistribs.length);
        }
      }
      nextFlex = wcs.open.length + distribs.open.length;
    }
    while (distribs.open.length > 0) {
      const userCourse = distribs.open[0];
      const unFulfilled = Object.values(GenEds).filter(genEd => (!genEd.fulfilled)).map(genEd => genEd.name);
      const unFulfilledDistribs = userCourse.course.distribs.filter((distrib) => {
        return unFulfilled.includes(fixDistrib(distrib));
      });
      const distrib = fixDistrib(unFulfilledDistribs[0]);
      userCourse.distrib = distrib;

      GenEds[distrib].filled += 1;
      console.log(userCourse.course.name, 'Is no longer being used for ', distrib);
      GenEds[distrib].course = GenEds[distrib].course ? [...GenEds[distrib].course, userCourse.course.name] : [userCourse.course.name];
      distribs.used.push(userCourse);
      if (GenEds[distrib].filled === GenEds[distrib].count) {
        GenEds[distrib].fulfilled = true;
      }
      distribs.open.splice(0, 1);
    }
  };

  // const findOtherDistrib = (unwantedDistrib, distribs) => {
  //   if (distribs.indexOf(unwantedDistrib) === 1) return 0;
  //   else if (distribs.indexOf(unwantedDistrib) === 0) return 1;
  //   else return null;
  // };

  renderGenEds = () => {
    return (
      <div className="reqs-list">
        {Object.values(GenEds).map((genEd) => {
          return (
            <div key={genEd.name} className="genEd-row">
              <img className="icon" src={genEd.icon} alt={`${genEd.name} icon`} data-tip data-for={genEd.name} />
              <ReactTooltip id={genEd.name} place="right" type="dark" effect="float">{genEd.fullName} - {genEd.count} - {genEd.course}</ReactTooltip>
              {/* <div className="genEd-name">{genEd.fullName}</div> */}
              <div className={genEd.fulfilled ? 'checkbox complete' : 'checkbox'}>{genEd.fulfilled ? 'Complete' : 'Incomplete'}</div>
              {/* <img className="checkbox" src={genEd.fulfilled ? checkedIcon : uncheckedIcon} alt="checkbox" /> */}
            </div>
          );
        })}
      </div>
    );
  };

  renderMajorReqs = () => {
    if (this.props.majors && this.props.majors.length > 0) {
      return (
        <div className="reqs-list">
          {this.props.majors.map((major) => {
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

  render() {
    const paneClass = classNames({
      requirements: true,
      pane: true,
      active: this.props.active,
    });

    const distribsButtonClass = classNames({
      distribs: true,
      toggle: true,
      active: this.state.distribsAction,
    });
    const majorButtonClass = classNames({
      major: true,
      toggle: true,
      active: !this.state.distribsAction,
    });

    return (
      <div className={paneClass} onClick={this.props.activate} role="presentation">
        <div className="pane-header">
          <h1 className="pane-title">Your Degree</h1>
          {this.props.active
            ? (
              <div className="requirements-toggle">
                <button type="button" className={distribsButtonClass} onClick={() => this.setState({ distribsAction: true })}>Distribs</button>
                <button type="button" className={majorButtonClass} onClick={() => this.setState({ distribsAction: false })}>Major</button>
              </div>
            )
            : <div /> }
        </div>
        <div className="pane-content">
          {this.state.distribsAction ? this.renderGenEds() : this.renderMajorReqs()}
        </div>
      </div>
    );
  }
}

export default RequirementsPane;
