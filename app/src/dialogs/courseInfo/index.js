import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import DialogWrapper from '../dialogWrapper';
import {
  addCourseToFavorites, removeCourseFromFavorites, addCourseToPlacements, removeCourseFromPlacement, fetchPlan, fetchUser, fetchCourseProfessors, showDialog,
} from '../../actions';
import checkedBox from '../../style/checkboxChecked.svg';
import bookmark from '../../style/bookmark.svg';
import bookmarkFilled from '../../style/bookmarkFilled.svg';
import plus from '../../style/plus.svg';
import minus from '../../style/minus.svg';
import link from '../../style/link_24px_blue.svg';
// import open from '../../style/open.svg';
import NonDraggableCourse from '../../components/nonDraggableCourse';

import './courseInfo.scss';
import { GenEds, APP_URL } from '../../constants';

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
        distribs.push(GenEds[distrib]);
      });
    }
    if (course.wcs && course.wcs.length) {
      course.wcs.forEach((wc) => {
        wcs.push(GenEds[wc]);
      });
    }

    return (
      <div id="distribs">
        <div className="section-header">Distributives</div>
        <div id="bubbles">
          {distribs.length > 0
            ? distribs.map((distrib, i) => {
              return (
                <img key={i.toString()} className="distrib-icon" src={distrib.icon} alt={distrib.name} />
              );
            }) : <div className="no-options-text">No distributives</div>}
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
                  <div className="median-bubble-grade"><div className="margin-bubble-text">{median.courses[0].median}</div></div>
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
          <div className="no-options-text">
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
        <div className="section-header" id="layup-header">
          <a className="layup-link" href={course.layup_url} target="_blank" rel="noopener noreferrer">Layup-List</a>
          {/* <img src={open} alt="open in new tab" /> */}
        </div>
        <div className="layup-score-container">
          <div>Layup-list Score:</div><div className="layup-score-accent">{course.layup_score}</div>
        </div>
        <div className="layup-score-container">
          <div>Quality Score:</div><div className="layup-score-accent">{course.quality_score}</div>
        </div>
      </div>
    );
  }

  /**
   * Handles rendering of the description.
   * @param {String} description
   */
  renderDescription = (description, orc_url) => {
    return (
      <div id="description">
        <div className="section-header">Description</div>
        <div className="description-text">{description}</div>
      </div>
    );
  }

  /**
   * Handles rendering of information for next term, if offered.
   * THIS FEATURE IS NOT COMPLETE, DEPENDENT ON GETTING THE PROFESSORS FOR EACH TIMESLOT
   * @param {*} course
   */
  renderNextTerm = (course) => {
    if (course.offered) {
      return (
        <div id="next-term">
          <div className="section-header">{`${this.props.currTerm.year.toString()}${this.props.currTerm.term}`}</div>
          <div id="periods">
            {course.periods.map((period) => {
              return (
                <div className="a-period" key={period}>
                  <span data-tip data-for={period}>{period}</span>
                  <ReactTooltip id={period} place="right" type="dark" effect="float">
                    {`Offered period ${period.toString()} for ${this.props.currTerm.year.toString()}${this.props.currTerm.term}`}
                  </ReactTooltip>
                </div>
              );
            })}
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
        <div className="section-header">Professor Reviews</div>
        {professors.map((p) => {
          return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div key={p.name} className="professor">
              <a href={`${APP_URL}/professors/${p.id}`} target="_blank" rel="noopener noreferrer" data-for={p.id} data-tip>{p.name}</a>
              <ReactTooltip id={p.id} place="right" type="dark" effect="float">
                See all reviews
              </ReactTooltip>
            </div>
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
          <div className="rule">
            One from {course.department} {o[dependencyType][0]} {(o[dependencyType][1] === 300) ? '+' : ` - ${o[dependencyType][1]}`}
          </div>
        );
      } else if (dependencyType === 'abroad') {
        return (
          <div className="rule">
            Study abroad needed.
          </div>
        );
      } else if (dependencyType) {
        return o[dependencyType].map((c) => {
          return (
            <div key={c.id.toString()}>
              <NonDraggableCourse course={c} currTerm={this.props.currTerm} />
              <div id="course-spacer-large" />
            </div>
          );
        });
      }
      return null;
    };
    return (
      <div id="dependenciesContainer">
        <div className="section-header">Prerequisites</div>
        <div id="dependencies">
          {prerequisites.length > 0
            ? prerequisites.map((o, i) => {
              let dependencyType = Object.keys(o).find((key) => {
                return (o[key].length > 0 && key !== '_id');
              });
              if (!dependencyType && Object.keys(o).includes('abroad')) dependencyType = 'abroad';

              const render = (
                <div key={i.toString()} className="dependency">
                  <div className="rule-header">{Dependencies[dependencyType]}</div>
                  <div id="course-spacer-large" />
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
            }) : <div className="no-options-text">No prerequisites</div>}
        </div>
      </div>
    );
  }

  renderOfferingsWrapper = (course) => {
    if (!course.terms_offered) {
      return (
        <div id="offerings">
          <div className="section-header">Past Offerings</div>
          <div className="no-options-text">No historical offering data</div>
        </div>
      );
    }

    const years = Object.entries(course.yearlyOccurences).sort((e1, e2) => {
      return e2[0] - e1[0];
    });

    return (
      <div id="offerings">
        <div className="section-header">Past Offerings</div>
        <div className="the-terms offering-row">
          <div className="offering-label">Term:</div>
          <div className="the-term" id="F">F</div>
          <div className="the-term">W</div>
          <div className="the-term">S</div>
          <div className="the-term" id="X">X</div>
        </div>
        <div className="the-offerings">
          {years.map(([year, terms]) => {
            return (
              <div className="offering-row" key={year}>
                {this.renderOfferings(year, terms)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  renderOfferings = (year, terms) => {
    return (
      <>
        <div className="offering-label">{`20${year.toString()}:`}</div>
        {
          ['F', 'W', 'S', 'X'].map((term, i) => {
            return <div key={i.toString()} className={`an-offering ${terms.includes(term) ? 'filled' : ''}`} />;
          })
        }
      </>
    );
  }

  renderOfferingsYearFinder = (element, desiredYear) => {
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
          className="action redirect"
          src={link}
          alt="See More"
          onClick={() => window.open(`/course/${courseID}`)}
          data-tip
          data-for="redirect"
        />
        <ReactTooltip id="redirect" place="bottom" type="dark" effect="float">
          {'See More'}
        </ReactTooltip>
        <img
          className="action"
          src={bookmarked ? bookmarkFilled : bookmark}
          alt="Bookmark"
          onClick={
            bookmarked
              ? () => this.props.removeCourseFromFavorites(courseID)
              : () => this.props.addCourseToFavorites(courseID)
          }
          data-tip
          data-for="bookmark"
        />
        <ReactTooltip id="bookmark" place="bottom" type="dark" effect="float">
          {!bookmarked ? 'Bookmark this course' : 'Unbookmark this course'}
        </ReactTooltip>
        <div className="spacer" />
        <img
          className="action"
          src={placement ? minus : plus}
          alt="Placement"
          onClick={
            placement
              ? () => this.props.removeCourseFromPlacement(courseID)
                .then(() => this.props.fetchUser())
              : () => this.props.addCourseToPlacements(courseID)
                .then(() => this.props.fetchUser())
          }
          data-tip
          data-for="plus"
        />
        <ReactTooltip id="plus" place="bottom" type="dark" effect="float">
          {!placement ? 'Add to your placement courses' : 'Remove from your placement courses'}
        </ReactTooltip>
      </div>
    );
  }

  /**
   * Master handlers for all information about the course.
   * @param {*} course
   * @param {String} nextTerm
   */
  courseInfo(course, nextTerm) {
    return (
      <div id="content">
        <div id="top">
          <div id="major">{`Department: ${course.department}`}</div>
          { (this.props.user.id) ? this.courseUserOptions(course.id) : null}
        </div>
        <hr className="horizontal-divider" />
        <div id="scrollable">
          <div id="first">{this.renderNextTerm(course, nextTerm)}{this.renderDescription(course.description, course.orc_url)}</div>
          <hr className="horizontal-divider-small" />
          <div id="metrics">
            {this.renderDistribs(course)}
            {this.renderMedians(course.medians)}
            {this.renderScores(course)}
          </div>
          <hr className="horizontal-divider-small" />
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
    console.log(this.props.previousCourses);
    return (
      <DialogWrapper {...this.props}>
        {this.courseInfo(this.props.data, this.props.nextTerm)}
      </DialogWrapper>
    );
  }
}

const mapStateToProps = state => ({
  nextTerm: state.time.nextTerm,
  currTerm: state.time.currTerm,
  plan: state.plans.current,
  user: state.user.current,
});

export default connect(mapStateToProps, {
  fetchPlan, fetchUser, addCourseToFavorites, removeCourseFromFavorites, addCourseToPlacements, removeCourseFromPlacement, showDialog, fetchCourseProfessors,
})(CourseInfoDialog);
