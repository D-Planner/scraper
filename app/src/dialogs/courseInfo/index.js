import React, { Component } from 'react';
import { connect } from 'react-redux';
import DialogWrapper from '../dialogWrapper';
// import bookmarkFilled from '../../style/bookmarkFilled.svg';
import {
  addCourseToFavorites, addCourseToPlacements, removeCourseFromFavorites, removePlacement, fetchPlan, fetchUser,
} from '../../actions';
import checkedBox from '../../style/checkboxChecked.svg';
import bookmark from '../../style/bookmark.svg';
import bookmarkFilled from '../../style/bookmarkFilled.svg';
import plus from '../../style/plus.svg';
import minus from '../../style/minus.svg';
import open from '../../style/open.svg';
import NonDraggableCourse from '../../components/nonDraggableCourse';

import './courseInfo.scss';
import { GenEds } from '../../constants';

const Dependencies = {
  req: 'Required (One of):',
  range: 'Required',
  grade: 'High Grade in:',
  rec: 'Reccomended',
};

/** displays information on a course -- displayed when a draggable course is clicked without dragging */
class CourseInfoDialog extends Component {
  /**
   * Handles rendering of distributive bubbles.
   * THIS FEATURE IS NOT COMPLETE, DEPENDENT ON MAKING [distrib] and [wc] BEINGS ARRAYS
   */
  renderDistribs = (course) => {
    // const distribTypesNames = distribTypes.map(distrib => distrib.name);
    const distribs = [];
    const wcs = [];
    if (course.distribs && course.distribs.length) {
      course.distribs.forEach((distrib) => {
        if (distrib === 'W' || distrib === 'NW' || distrib === 'CI') {
          wcs.push(GenEds[distrib]);
        } else {
          distribs.push(GenEds[distrib]);
        }
      });
    }
    return (
      <div id="distribs">
        <div className="section-header">Distributives</div>
        <div id="bubbles">
          {distribs.map((distrib, i) => {
            return (
              <img key={i.toString()} className="distrib-icon" src={distrib.icon} alt={distrib.name} />
            );
          })}
          {(wcs.length === 0 || distribs.length === 0) ? null : <div className="vertical-divider" />}
          {wcs.map((wc, i) => {
            return (
              <img key={i.toString()} className="wc-icon" src={wc.icon} alt={wc.name} />
            );
          })}
        </div>

      </div>
    );
  }

  /**
   * Handles rendering of medians, cuts off after 5 terms.
   * @param {Array} medians
   */
  renderMedians = (medians) => {
    if (medians !== null) {
      let cutOff = medians.length;
      if (medians.length > 5) cutOff = 5;
      return (
        <div id="medians">
          <div className="section-header">Medians</div>
          <div id="bubbles">
            {
            medians.slice(0, cutOff).map((median) => {
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
    } else {
      return (
        <div id="medians">
          <div className="section-header">Medians</div>
          <div className="sad">
            No medians available.
          </div>
        </div>
      );
    }
  }

  /**
   * Handles rendering of scores.
   * @param {*} course
   */
  renderScores = (course) => {
    return (
      <div id="scores">
        <div className="section-header" id="layup-header"><a href={course.layup_url} target="_blank" rel="noopener noreferrer">Layup-list</a><img src={open} alt="open in new tab" /></div>
        <div>
          Layup-list Score: {course.layup_score}
        </div>
        <div>
          Quality Score: {course.quality_score}
        </div>
      </div>
    );
  }

  /**
   * Handles rendering of the description.
   * @param {String} description
   */
  renderDescription = (description, orc_url) => {
    if (description && description.length > 600) {
      return (
        <div id="description">
          <div className="section-header">Description</div>
          {`${description.substring(0, 600)}... `}<a href={orc_url} target="_blank" rel="noopener noreferrer">read more</a>
        </div>
      );
    } else {
      return (
        <div id="description">
          <div className="section-header">Description</div>
          {description} <a href={orc_url} target="_blank" rel="noopener noreferrer">read more</a>
        </div>
      );
    }
  }

  /**
   * Handles rendering of information for next term, if offered.
   * THIS FEATURE IS NOT COMPLETE, DEPENDENT ON HAVING A UNIVERSAL TERM ON OUR API SERVER
   * THIS FEATURE IS NOT COMPLETE, DEPENDENT ON FIXING THE [timeslot] PROPERTY.
   * @param {*} course
   * @param {String} nextTerm
   */
  renderNextTerm = (course, nextTerm) => {
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
  }

  /**
   * Test for Professors
   *
   *
   */
  renderProfessors = (professors) => {
    return (
      <div id="professors">
        <div className="section-header">Professors</div>
        {professors.slice(0, 5).map((p) => {
          return (
            <div key={p.name} className="professor">{p.name}</div>
          );
        })}
      </div>
    );
  }

  renderPrerequisites = (course) => {
    const { prerequisites } = course;

    const renderPrereqByType = (o, dependencyType) => {
      if (dependencyType === 'range') {
        return (
          <div>
            One from {course.department} {o[dependencyType][0]} {(o[dependencyType][1] === 300) ? '+' : ` - ${o[dependencyType][1]}`}
          </div>
        );
      } else if (dependencyType === 'abroad') {
        return (
          <div>
            This course requires having been abroad.
          </div>
        );
      } else if (dependencyType) {
        return o[dependencyType].map((c) => {
          console.log('Prereq', c);
          return (
            <NonDraggableCourse
              key={c.id.toString()}
              course={c}
            />
          );
        });
      }
      return null;
    };
    return (
      <div id="dependenciesContainer">
        <div className="section-header">Prerequisites</div>
        <div id="dependencies">
          {prerequisites.map((o, i) => {
            let dependencyType = Object.keys(o).find((key) => {
              return (o[key].length > 0 && key !== '_id');
            });
            if (!dependencyType && Object.keys(o).includes('abroad')) dependencyType = 'abroad';

            const render = (
              <div key={i.toString()} className="dependency">
                <div className="section-header">{Dependencies[dependencyType]}</div>
                {renderPrereqByType(o, dependencyType)}
              </div>
            );
            if (!this.props.previousCourses) return render;
            switch (dependencyType) {
              case 'req':
                return (o[dependencyType].some((c) => {
                  return (this.props.previousCourses) ? this.props.previousCourses.includes(c._id) : false;
                })) ? <img key={i.toString()} src={checkedBox} alt="fulfilled" /> : render;
              case 'range':
                return (this.props.previousCourses.some((c) => {
                  return (o[dependencyType][0] <= c.number && c.number <= o[dependencyType][1] && c.department === course.department);
                })) ? <img key={i.toString()} src={checkedBox} alt="fulfilled" /> : render;
              default:
                return render;
            }
          })}
        </div>
      </div>
    );
  }

  renderOfferingsWrapper = (course) => {
    if (!course.terms_offered) {
      return (
        <div id="offerings">
          <div className="section-header">Offerings</div>
          <div className="sad">No historical offering data.</div>
        </div>
      );
    }
    const years = [];
    let earliestYear = 20; // TO-DO: need to make this lively updated from the server for the current term

    course.terms_offered.forEach((termOffered) => {
      const term = termOffered.substring(termOffered.length - 1);
      const yearInt = parseInt(termOffered.substring(0, termOffered.length - 1), 10);

      if (yearInt < earliestYear) {
        earliestYear = yearInt;
      }

      const yearToModifyIndex = years.findIndex((element) => { return this.renderOfferingsYearFinder(element, yearInt); });

      if (yearToModifyIndex !== -1) {
        years[yearToModifyIndex].terms.push(term);
      } else {
        years.push({
          yearInt,
          terms: [term],
        });
      }
    });

    years.sort(this.renderOfferingsSorter);
    return (
      <div id="offerings">
        <div className="section-header">Offerings</div>
        <div className="the-terms offering-row">
          <div className="the-term" id="F">F</div>
          <div className="the-term">W</div>
          <div className="the-term">S</div>
          <div className="the-term" id="X">X</div>
        </div>
        <div className="the-offerings">
          {years.map((year) => {
            return (
              <div className="offering-row" key={year.yearInt}>
                {this.renderOfferings(year)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  renderOfferings = (year) => {
    console.log(year.terms);
    return (
      <>
        {year.terms.includes('F') ? <div className="an-offering" /> : null}
        {year.terms.includes('W') ? <div className="an-offering" /> : null}
        {year.terms.includes('S') ? <div className="an-offering" /> : null}
        {year.terms.includes('X') ? <div className="an-offering" /> : null}
      </>
    );
  }

  renderOfferingsYearFinder = (element, desiredYear) => {
    return (element.yearInt === desiredYear);
  }

  fuck = (element, desiredYear) => {
    console.log(`\tit is ${element.yearInt.toString()}`);
    console.log(`\tlooking for ${desiredYear.toString()}`);
    return (element.yearInt === desiredYear);
  }

  renderOfferingsSorter = (year1, year2) => {
    if (year1.yearInt > year2.yearInt) {
      return -1;
    } else {
      return 1;
    }
  }

  courseUserOptions(courseID) {
    const bookmarked = this.props.user.favorite_courses.map(c => c.id).includes(courseID);
    const placement = this.props.user.placement_courses.map(c => c.id).includes(courseID);
    return (
      <div id="user-actions">
        <img
          className="action"
          src={bookmarked ? bookmarkFilled : bookmark}
          alt="Bookmark"
          onClick={
            bookmarked
              ? () => this.props.removeCourseFromFavorites(this.props.data.id)
              : () => this.props.addCourseToFavorites(this.props.data.id)
          }
        />
        <div className="spacer" />
        <img
          className="action"
          src={placement ? minus : plus}
          alt="Placement"
          onClick={
            placement
              ? () => this.props.removePlacement(this.props.data.id)
                .then(() => this.props.fetchPlan(this.props.plan.id))
                .then(() => this.props.fetchUser())
              : () => this.props.addCourseToPlacements(this.props.data.id)
                .then(() => this.props.fetchPlan(this.props.plan.id))
                .then(() => this.props.fetchUser())
          }
        />
      </div>
    );
  }

  /**
   * Master handlers for all information about the course.
   * @param {*} course
   * @param {String} nextTerm
   */
  courseInfo(course, nextTerm) {
    // console.log('Likely Terms: ', course.likely_terms);
    return (
      <div id="content">
        <div id="top">
          <div id="major">Major features coming soon!</div>
          { (this.props.user.id) ? this.courseUserOptions(course.id) : null}
        </div>
        <hr className="horizontal-divider" />
        <div id="scrollable">
          <div id="first">{this.renderNextTerm(course, nextTerm)}{this.renderDescription(course.description, course.orc_url)}</div>
          <div id="metrics">
            {this.renderDistribs(course)}
            {this.renderMedians(course.medians)}
            {this.renderScores(course)}
          </div>
          <div id="last">
            {this.renderPrerequisites(course)}
            {this.renderOfferingsWrapper(course)}
            {this.renderProfessors(course.professors)}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <DialogWrapper {...this.props}>
        {this.courseInfo(this.props.data, this.props.nextTerm)}
      </DialogWrapper>
    );
  }
}

const mapStateToProps = state => ({
  nextTerm: state.time.nextTerm,
  plan: state.plans.current,
  user: state.user.current,
});

export default connect(mapStateToProps, {
  addCourseToPlacements, fetchPlan, fetchUser, addCourseToFavorites, removeCourseFromFavorites, removePlacement,
})(CourseInfoDialog);
