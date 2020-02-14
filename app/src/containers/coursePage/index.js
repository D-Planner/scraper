/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  fetchCourse, fetchCoursePublic, addCourseToFavorites, addCourseToPlacements, removeCourseFromFavorites, removeCourseFromPlacements, fetchPlan, fetchUser, fetchCourseProfessors, showDialog, getTimes,
} from '../../actions';
import checkedBox from '../../style/checkboxChecked.svg';
import bookmark from '../../style/bookmark.svg';
import bookmarkFilled from '../../style/bookmarkFilled.svg';
import plus from '../../style/plus.svg';
import minus from '../../style/minus.svg';
// import open from '../../style/open.svg';
import NonDraggableCourse from '../../components/nonDraggableCourse';
import {
  GenEdsForDisplay as GenEds, APP_URL, metaContentSeparator, universalMetaTitle, errorLogging,
} from '../../constants';
import LoadingWheel from '../../components/loadingWheel';
import HeaderMenu from '../../components/headerMenu';
import './coursePage.scss';

const invalidCourse = id => ({
  title: 'Error: Course not found',
  description: `The course with id '${id}' could not be found.`,
  medians: [{ term: '--', avg_numeric_value: 0, courses: [{ median: '--' }] }, { term: '--', avg_numeric_value: 0, courses: [{ median: '--' }] }, { term: '--', avg_numeric_value: 0, courses: [{ median: '--' }] }, { term: '--', avg_numeric_value: 0, courses: [{ median: '--' }] }, { term: '--', avg_numeric_value: 0, courses: [{ median: '--' }] }],
  layup_score: '--',
  quality_score: '--',
  distribs: [],
  prerequisites: [],
  professors: [],
  department: '--',
});

const Dependencies = {
  req: 'Required (One of):',
  range: 'Required',
  grade: 'High Grade in:',
  rec: 'Reccomended',
};

const MAX_META_DESCRIPTION_LENGTH = 160;
const cutCharacters = ['.', '?', '!', '…'];

/**
 * Generates a meta tag based on a given string
 * @param {*} description
 */
function generateMetaDescription(description) {
  let sliceIndex = -1;
  let spaceSliceIndex = -1;

  for (let i = MAX_META_DESCRIPTION_LENGTH - 1; i >= 0; i -= 1) {
    // Find first sentence conclusion / break in string
    if (sliceIndex === -1 && cutCharacters.indexOf(description.charAt(i)) !== -1) {
      sliceIndex = i;

    // Find first space in string
    } else if (spaceSliceIndex === -1 && description.charAt(i) === ' ') {
      // Remove preceeding comma if present
      if (description.charAt(i - 1) === ',') {
        spaceSliceIndex = i - 1;
      } else {
        spaceSliceIndex = i;
      }
    }
  }

  // Automatically generate description based on whether a slice index was found
  if (sliceIndex !== -1) {
    return `${description.slice(0, sliceIndex + 1)}…`;
  } else {
    return `${description.slice(0, spaceSliceIndex)}…`;
  }
}

// function getProfessor(id) {
//   return new Promise((resolve, reject) => {
//     axios.get(`${ROOT_URL}/professors/${id}`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//     }).then((response) => {
//       resolve(response.data);
//     }).catch((error) => {
//       reject(error);
//     });
//   });
// }

const loggingErrorsInCoursePage = (message) => {
  errorLogging('app/src/containers/coursePage.js', message);
};

class CoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    // this.props.fetchUser();
    this.props.getTimes();
    this.props.fetchCourse(this.props.match.params.id).then((course) => {
      this.setState({ course });
    }).catch((error) => {
      this.setState({ course: invalidCourse(this.props.match.params.id) });
      loggingErrorsInCoursePage(error);
    });
  }

  // Detects click on course and reloads
  componentDidUpdate(prevProps) {
    try {
      if (prevProps.match.params.id !== this.props.match.params.id) {
        window.location.reload();
      }

      if (!this.state.metaDescription && this.state.course) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState(prevState => ({ metaDescription: generateMetaDescription(prevState.course.description) }));
      }
    } catch (e) {
      loggingErrorsInCoursePage(e);
    }
  }

  /**
   * Handles rendering of distributive bubbles.
   */
  renderDistribs = (course) => {
    const distribs = [];
    const wcs = [];
    try {
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
    } catch (e) {
      loggingErrorsInCoursePage(e);
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
          <a className="layup-link coursePage-link" href={course.layup_url} target="_blank" rel="noopener noreferrer">Layup-List</a>
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
    if (this.props.authenticated === false) {
      return (
        <div id="next-term">
          <div className="section-header">Off.</div>
          <div id="periods">
            <div className="a-period" key="invalid">
              <span data-tip data-for="invalid">--</span>
              <ReactTooltip id="invalid" place="right" type="dark" effect="float">
                To see when this course is offered, sign in above.
              </ReactTooltip>
            </div>
          </div>
        </div>
      );
    } else if (course.offered) {
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
        {professors.length > 0 ? professors.map((p) => {
          return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div key={p.name} className="professor">
              <a className="coursePage-link" href={`${APP_URL}/professors/${p.id}`} target="_blank" rel="noopener noreferrer" data-for={p.id} data-tip>{p.name}</a>
              <ReactTooltip id={p.id} place="right" type="dark" effect="float">
                See all reviews
              </ReactTooltip>
            </div>
          );
        }) : <div className="professor empty">No professor data</div> }
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
              {/* ADD ID VERIFICATION AND INVALID PAGE MESSAGE */}
              <NonDraggableCourse course={c} currTerm={this.props.currTerm} click={() => this.props.history.push(`/course/${c._id}`)} />
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
    if (this.props.authenticated === true) {
      const bookmarked = this.props.user.favorite_courses ? this.props.user.favorite_courses.map(c => c.id).includes(courseID) : [];
      const placement = this.props.user.placement_courses ? this.props.user.placement_courses.map(c => c.id).includes(courseID) : [];
      return (
        <div id="user-actions">
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
            {!bookmarked ? 'Bookmark this course' : 'Unbookmark'}
          </ReactTooltip>
          <div className="spacer" />
          <img
            className="action"
            src={placement ? minus : plus}
            alt="Placement"
            onClick={
            placement
              ? () => this.props.removeCourseFromPlacements(courseID)
                .then(() => this.props.fetchUser())
              : () => this.props.addCourseToPlacements(courseID)
                .then(() => this.props.fetchUser())
          }
            data-tip
            data-for="plus"
          />
          <ReactTooltip id="plus" place="bottom" type="dark" effect="float">
            {!bookmarked ? 'Add this to courses you have placed out of (by AP credits, exams, etc)' : 'Remove from your placement courses'}
          </ReactTooltip>
        </div>
      );
    } else {
      return (
        <div id="user-actions">
          <div className="action-message">Sign in to see more</div>
          <img
            className="action"
            src={bookmark}
            alt="Bookmark"
            data-tip
            data-for="bookmark"
          />
          <ReactTooltip id="bookmark" place="bottom" type="dark" effect="float">
            Sign in to bookmark this course
          </ReactTooltip>
          <div className="spacer" />
          <img
            className="action"
            src={plus}
            alt="Placement"
            data-tip
            data-for="plus"
          />
          <ReactTooltip id="plus" place="bottom" type="dark" effect="float">
            Sign in to add this to courses you have placed out of
          </ReactTooltip>
        </div>
      );
    }
  }

  // renderReviews(course) {
  //   console.log(this.props);

  //   console.log(course);
  //   return (
  //     <>
  //       <div className="section-header">Reviews</div>
  //       {course ? course.professors.map((professor) => {
  //         return (
  //           <div key={professor._id} className="professor-container">
  //             <div className="professor-title">{professor.name}</div>

  //             {/* {professor.map((r) => {
  //               return (
  //                 <div className="review-container">
  //                   <div className="review-title" />
  //                   <div className="review-content">
  //                     {
  //                       axios.get(`${ROOT_URL}/professors/${professor._id}`, {
  //                         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  //                       }).then((response) => {
  //                         return (response.data);
  //                       })
  //                     }
  //                   </div>
  //                 </div>
  //               );
  //             })} */}

  //             {
  //               getProfessor(professor._id).then((reviews) => {
  //                 console.log(reviews);
  //                 return (<div>Test</div>);
  //               }).catch((error) => {
  //                 console.error(error);
  //                 return (<div />);
  //               })
  //             }

  //           </div>
  //         );
  //       }) : null}
  //     </>
  //   );
  // }

  /**
   * Master handlers for all information about the course.
   * @param {*} course
   * @param {String} nextTerm
   */
  courseInfo(course, nextTerm) {
    console.log(this.props.authenticated);
    return (
      <div id="content">
        <h1 className="course-info-title">{this.state.course.title}</h1>
        <div id="top">
          <div id="major">{`Department: ${course.department}`}</div>
          {this.courseUserOptions(course.id)}
        </div>
        <hr className="horizontal-divider" />
        <div id="scrollable">
          {this.props.authenticated === false ? (
            <>
              <div id="intro-coursepage">
                <div className="section-header">Want to get the most from college?</div>
                <div className="intro-coursepage-text">D-Planner is a plan-based academic planning suite built to enable students to take advantage of their academic opportunities in higher education. We believe that through data curation and insightful analytics students are better prepared to succeed, both in college and beyond. To begin planning for your future, sign up above.</div>
              </div>
              <hr className="horizontal-divider-small" />
            </>
          ) : null}
          <div id="first">{this.renderNextTerm(course, nextTerm)}{this.renderDescription(course.description, course.orc_url)}</div>
          <hr className="horizontal-divider-small" />
          <div id="metrics">
            {this.renderDistribs(course)}
            {this.renderMedians(course.medians)}
            {this.renderScores(course)}
          </div>
          <hr className="horizontal-divider-small" />
          {this.props.authenticated === true
            ? (
              <>
                <div id="last">
                  {this.renderPrerequisites(course)}
                  {this.renderOfferingsWrapper(course)}
                  {this.renderProfessors(course.professors)}
                </div>
                <hr className="horizontal-divider-small" />
              </>
            ) : <div id="last" style={{ flexDirection: 'column' }}><div className="section-header">Sign in to see more</div><div className="last-message">To see more, please sign in or sign up above.</div></div>}
          {/* <div id="reviews-course-page">
            {this.renderReviews(course)}
          </div> */}
        </div>
      </div>
    );
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{this.state.course ? `${this.state.course.department} ${this.state.course.number}` : 'Course'} - Dartmouth{metaContentSeparator}{universalMetaTitle}</title>
          <meta name="description" content={this.state.metaDescription || ''} />
          <meta name="keywords" content="" />
        </Helmet>
        <HeaderMenu menuOptions={this.props.authenticated ? { name: 'Go Home', callback: () => this.props.history.push('/') } : null} />
        <div className="course-info-container">
          {this.state.course ? this.courseInfo(this.state.course, this.props.nextTerm) : <LoadingWheel />}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.current,
  currTerm: state.time.currTerm,
  nextTerm: state.time.nextTerm,
  authenticated: state.auth.authenticated,
});

export default withRouter(connect(mapStateToProps, {
  fetchCourse, fetchCoursePublic, addCourseToFavorites, addCourseToPlacements, removeCourseFromFavorites, removeCourseFromPlacements, fetchPlan, fetchUser, fetchCourseProfessors, showDialog, getTimes,
})(CoursePage));
