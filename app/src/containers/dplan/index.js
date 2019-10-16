import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import uuid from 'uuid';
import {
  deletePlan, fetchPlan, addCourseToTerm, removeCourseFromTerm, showDialog, getTimes, createPlan, setDraggingFulfilledStatus,
} from '../../actions';
import { DialogTypes } from '../../constants';
import { emptyPlan } from '../../services/empty_plan';
import Sidebar from '../sidebar';
import Dashboard from '../dashboard';
// import noPlan from '../../style/no-plan.png';
import trash from '../../style/trash.svg';
import Term from '../term';
import './dplan.scss';

const [ERROR, WARNING, CLEAR] = ['error', 'warning', ''];

/** Contains one of a user's plans, with all available terms and a sidebar with other information */
class DPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noPlan: true,
    };

    this.setCurrentPlan = this.setCurrentPlan.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.createNewPlan = this.createNewPlan.bind(this);
    this.showNewPlanDialog = this.showNewPlanDialog.bind(this);
    this.getFlattenedCourses = this.getFlattenedCourses.bind(this);
    this.addCourseToTerm = this.addCourseToTerm.bind(this);
    this.removeCourseFromTerm = this.removeCourseFromTerm.bind(this);
    this.props.getTimes();
  }

  componentDidMount() {
    // if (typeof this.props.match.params.id === 'undefined') {
    //   this.setState({
    //     noPlan: true,
    //   });
    // } else {
    //   this.props.fetchPlan(this.props.match.params.id);
    // }
  }

  setCurrentPlan(planID) {
    console.log('Setting Current Plan');
    this.props.fetchPlan(planID);
    this.setState({
      noPlan: false,
    });
  }

  getFlattenedCourses() {
    const courses = [];
    this.props.plan.terms.forEach((year) => {
      year.forEach((term) => {
        courses.push(...term.courses);
      });
    });
    return courses;
  }

  getFlattenedTerms() {
    const terms = [];
    this.props.plan.terms.forEach((y) => {
      y.forEach((term) => {
        terms.push(term);
      });
    });
    return terms;
  }

  // This still isn't working
  setAllFulfilledStatus = (termID, courseID) => {
    console.log('GETFULFILLEDSTATUS', termID, courseID);
    try {
      this.getFlattenedTerms().forEach((term) => {
        if (term._id === termID) {
          const previousCourses = this.getFlattenedTerms().filter((t) => {
            return t.index <= term.index;
          }).map((t) => {
            return t.previousCourses;
          }).flat()
            .map((t) => { return t.toString(); });
          const prevCourses = [...new Set((this.props.user.placement_courses.length)
            ? this.props.user.placement_courses.map((c) => { return c.toString(); }).concat(previousCourses)
            : previousCourses)];

          this.getFlattenedCourses().forEach((userCourse) => {
            if (userCourse.id === courseID) {
              const getValue = (uCourse) => {
                const { course } = uCourse;
                let prereqs = course.prerequisites ? course.prerequisites : [];
                if (!prereqs || prereqs.length === 0) {
                  return CLEAR;
                }
                prereqs = prereqs.map((o) => {
                  let dependencyType = Object.keys(o).find((key) => {
                    return (o[key].length > 0 && key !== '_id');
                  });
                  if (!dependencyType && Object.keys(o).includes('abroad')) dependencyType = 'abroad';

                  const prevCoursesIncludes = () => {
                    return o[dependencyType].map((c) => { return c.id.toString(); })
                      .some((id) => {
                        return (prevCourses.length) ? prevCourses.includes(id) : false;
                      });
                  };

                  switch (dependencyType) {
                    case 'abroad':
                      return WARNING;
                    case 'req':
                      return prevCoursesIncludes() ? CLEAR : ERROR;
                    case 'range':
                      return (prevCourses.some((c) => {
                        return (o[dependencyType][0] <= c.number && c.number <= o[dependencyType][1] && c.department === this.course.department);
                      })) ? CLEAR : ERROR;
                    case 'grade':
                      return prevCoursesIncludes() ? WARNING : ERROR;
                    case 'rec':
                      return prevCoursesIncludes() ? WARNING : ERROR;
                    default:
                      return CLEAR;
                  }
                });

                if (prereqs.includes(ERROR)) {
                  return ERROR;
                }
                if (prereqs.includes(WARNING)) {
                  return WARNING;
                }

                return CLEAR;
              };
              userCourse.fulfilledStatus = getValue(userCourse);
            }
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  setPreviousCourses = () => {
    console.log('[setPreviousCourses Dplan.js]');
    const previousByTerm = this.getFlattenedTerms().map((term) => {
      const prevCourses = [...new Set(this.getFlattenedTerms()
        .sort((t1, t2) => {
          return t1.index - t2.index;
        })
        .filter((t) => {
          return t.index < term.index;
        })
        .map((t) => {
          return t.courses;
        })
        .flat()
        .filter((c) => {
          return c.fulfilledStatus === '';
        })
        .map((c) => {
          return (c.course.xlist.length) ? [...c.course.xlist, c.course.id] : c.course.id;
        })
        .flat())];
      return { [term._id]: prevCourses };
    });
    previousByTerm.forEach((t) => {
      Object.entries(t).forEach(([term, previousCourses]) => {
        this.getFlattenedTerms()
          .forEach((x) => {
            if (x._id === String(term)) {
              x.previousCourses = previousCourses;
              x.courses.forEach((course) => {
                this.setAllFulfilledStatus(x._id, course.id);
              });
            }
          });
      });
    });
  // Promise.all(previousByTerm.map((t) => {
  //     return Promise.all(Object.entries(t).map(([term, previousCourses]) => {
  //         return Term.findByIdAndUpdate(term, { previousCourses })
  //             .then(() => {
  //                 return Term.findById(term)
  //                     .populate(PopulateTerm);
  //             }).then((trueTerm) => {
  //                 return Promise.all(trueTerm.courses.map((course) => {
  //                     return Promise.resolve(CoursesController.getFulfilledStatus(planID, trueTerm._id, course.course.id, userID))
  //                         .then((status) => {
  //                             // console.log(`Updating ${course.course.title} to ${status}`);
  //                             return UserCourse.update({ _id: course.id }, { fulfilledStatus: status }, { upsert: true });
  //                         });
  //                 // .then(() => {
  //                 //     UserCourse.findById(course.id).populate('course').then((c) => { console.log('SET', c.course.title, c.fulfilledStatus); });
  //                 // });
  //                 }));
  //             });
  //     })).then((r) => {
  //         // console.log('{1}', r);
  //         return r;
  //     });
  // })).then((r) => {
  //     // console.log('{2}', r);
  //     resolve();
  // });
  }

  addCourseToTerm = (course, term) => new Promise((resolve, reject) => {
    console.log('[DPLAN.js] We got request to add course to term');
    try {
      this.props.plan.terms.forEach((y) => {
        y.forEach((t) => {
          if (t._id === term._id) {
            // Might need to make an API call here just to create a userCourse.
            const id = uuid.v4();
            const userCourse = {
              user: this.props.user.id,
              course,
              term: t._id,
              major: null,
              distrib: null,
              wc: null,
              timeslot: course.preiods && course.periods.length === 1 ? course.periods[0] : null,
              fulfilledStatus: '',
              _id: id,
              id,
            };
            t.courses.push(userCourse);
          }
        });
      });
      this.setPreviousCourses();
      resolve();
    } catch (e) {
      console.log(e);
      reject(e);
    }
    // this.props.addCourseToTerm(course, term, this.props.plan.id).then(() => {
    //   console.log(`[DPLAN.js] The course \n${course.name} has been added to term \n${term.id}`);
    //   return this.props.fetchPlan(this.props.plan.id);
    // }).then(() => {
    //   console.log('[DPLAN.js] fetched plan');
    //   resolve();
    // }).catch((err) => {
    //   console.log(err);
    //   reject();
    // });
  })

  removeCourseFromTerm = (userCourseID, termID) => new Promise((resolve, reject) => {
    console.log('[DPLAN.js] We got request to remove course from term');
    console.log(userCourseID, termID);
    try {
      this.props.plan.terms.forEach((y) => {
        y.forEach((t) => {
          if (t._id === termID) {
            t.courses = t.courses.filter((c) => {
              // Might need to make API Call here to remove UserCourse
              return c.id.toString() !== userCourseID.toString();
            });
          }
        });
      });
      // Set Previous Courses for Each Term here
      this.setPreviousCourses();
      resolve();
    } catch (e) {
      console.log(e);
      reject(e);
    }
  })

  setDraggingFulfilledStatus = courseID => new Promise((resolve, reject) => {
    console.log('[DPLAN.js] We got request to set Dragging Status for', courseID);
    // this.props.setDraggingFulfilledStatus(this.props.plan.id, courseID).then(() => {
    //   resolve();
    // }).catch((e) => {
    //   console.log(e);
    //   reject();
    // });
  });

  showDialog() {
    const opts = {
      title: 'Delete plan',
      okText: 'Delete',
      onOk: () => {
        this.props.deletePlan(this.props.plan.id, this.props.history);
      },
    };
    this.props.showDialog(DialogTypes.DELETE_PLAN, opts);
  }

  showNewPlanDialog() {
    const dialogOptions = {
      title: 'Name your plan',
      okText: 'Create',
      onOk: (name, gradYear) => {
        this.createNewPlan(name, gradYear);
      },
    };
    this.props.showDialog(DialogTypes.NEW_PLAN, dialogOptions);
  }

  createNewPlan(name, gradYear) {
    const terms = ['F', 'W', 'S', 'X'];
    let currYear = gradYear - 4;
    let currQuarter = -1;
    this.props.createPlan({
      terms: emptyPlan.terms.map((term) => {
        if (currQuarter === 3) currYear += 1;
        currQuarter = (currQuarter + 1) % 4;
        return { ...term, year: currYear, quarter: terms[currQuarter] };
      }),
      name,
    }, this.setCurrentPlan);
  }


  renderNewPlanButton = (fn) => {
    return (
      <button type="button" className="newPlanButton" id="newPlanButton" onClick={fn}>New Plan</button>
    );
  };

  renderPlanName = (planName) => {
    if (planName.length > 20) {
      return `${planName.substring(0, 20)}...`;
    } else {
      return planName;
    }
  };

  render() {
    if (!this.props.plan || this.state.noPlan) {
      return (
        <div className="dashboard">
          <Dashboard setCurrentPlan={this.setCurrentPlan} />
          <div className="welcome-text">
            <div className="welcome-title">Welcome to D-Planner!</div>
            <div className="welcome-subtitle">Get started by creating a new Plan.</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="dashboard">
          <Dashboard setCurrentPlan={this.setCurrentPlan} />
          <div className="plan-content">
            <div className="plan-side">
              <div className="plan-header">
                <h1 className="plan-name">{this.renderPlanName(this.props.plan.name)}</h1>
                <button type="button" className="settings-button" onClick={this.showDialog}>
                  <img src={trash} alt="" />
                </button>
              </div>
              <Sidebar className="sidebar" planCourses={this.getFlattenedCourses()} setDraggingFulfilledStatus={this.setDraggingFulfilledStatus} />
            </div>
            <div className="plan-grid">
              {this.props.plan.terms.map((year) => {
                return (
                  <div className="plan-row" key={year[0].id}>
                    {year.map((term) => {
                      return (
                        <Term
                          plan={this.props.plan}
                          time={this.props.time}
                          term={term}
                          key={term.id}
                          addCourseToTerm={this.addCourseToTerm}
                          removeCourseFromTerm={this.removeCourseFromTerm}
                          setDraggingFulfilledStatus={this.setDraggingFulfilledStatus}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  }
}


const mapStateToProps = state => ({
  plans: state.plans.all,
  plan: state.plans.current,
  time: state.time,
  user: state.user.current,
});

export default withRouter(connect(mapStateToProps, {
  fetchPlan, deletePlan, addCourseToTerm, removeCourseFromTerm, showDialog, getTimes, createPlan, setDraggingFulfilledStatus,
})(DPlan));
