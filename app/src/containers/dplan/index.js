/* eslint-disable no-alert */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { HotKeys } from 'react-hotkeys';
import {
  deletePlan, fetchPlan, addCourseToTerm, removeCourseFromTerm, showDialog, getTimes, createPlan, setDraggingFulfilledStatus, fetchUser, fetchPlans, updateCloseFocus, updatePlan, sendVerifyEmail, setFulfilledStatus, addPlaceholderCourse, removePlaceholderCourse,
} from '../../actions';
import { DialogTypes, ROOT_URL } from '../../constants';
import { emptyPlan } from '../../services/empty_plan';
import Sidebar, { paneTypes } from '../sidebar';
import Dashboard from '../dashboard';
// import noPlan from '../../style/no-plan.png';
import trash from '../../style/trash.svg';
import check from '../../style/check.svg';
import Term from '../term';
import './dplan.scss';


const [ERROR, WARNING, CLEAR] = ['error', 'warning', ''];

/** Contains one of a user's plans, with all available terms and a sidebar with other information */
class DPlan extends Component {
  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values for more
  keyMap = {
    PLAN_ONE: 'Control+1',
    PLAN_TWO: 'Control+2',
    PLAN_THREE: 'Control+3',
    PLAN_FOUR: 'Control+4',
    PLAN_FIVE: 'Control+5',
    PLAN_SIX: 'Control+6',
    PLAN_SEVEN: 'Control+7',
    PLAN_EIGHT: 'Control+8',
    PLAN_NINE: 'Control+9',
    PLAN_TEN: 'Control+0',
    CLOSE: 'Escape', // Close all plans
    SAVE: 'Control+s',
    OPEN_NEW_PLAN: 'Control+p',
    OPEN_DELETE_PLAN: 'Control+d',
    OPEN_SEARCH_PANE: 'Control+q',
    OPEN_REQUIREMENTS_PANE: 'Control+r',
    OPEN_BOOKMARKS_PANE: 'Control+b',
  };

  handlers = {
    PLAN_ONE: event => this.keyCommandWrapper(() => this.setCurrentPlan(this.props.plans[0].id), event),
    PLAN_TWO: event => this.keyCommandWrapper(() => this.setCurrentPlan(this.props.plans[1].id), event),
    PLAN_THREE: event => this.keyCommandWrapper(() => this.setCurrentPlan(this.props.plans[2].id), event),
    PLAN_FOUR: event => this.keyCommandWrapper(() => this.setCurrentPlan(this.props.plans[3].id), event),
    PLAN_FIVE: event => this.keyCommandWrapper(() => this.setCurrentPlan(this.props.plans[4].id), event),
    PLAN_SIX: event => this.keyCommandWrapper(() => this.setCurrentPlan(this.props.plans[5].id), event),
    PLAN_SEVEN: event => this.keyCommandWrapper(() => this.setCurrentPlan(this.props.plans[6].id), event),
    PLAN_EIGHT: event => this.keyCommandWrapper(() => this.setCurrentPlan(this.props.plans[7].id), event),
    PLAN_NINE: event => this.keyCommandWrapper(() => this.setCurrentPlan(this.props.plans[8].id), event),
    PLAN_TEN: event => this.keyCommandWrapper(() => this.setCurrentPlan(this.props.plans[9].id), event),
    CLOSE: event => this.keyCommandWrapper(() => this.setCurrentPlan(null), event),
    SAVE: event => this.keyCommandWrapper(() => alert('D-Planner automatically saves your work!'), event), // TODO: Add to announcement bar
    OPEN_NEW_PLAN: event => this.keyCommandWrapper(() => this.showNewPlanDialog(), event),
    OPEN_DELETE_PLAN: event => this.keyCommandWrapper(() => this.deletePlanKeyPress(this.props.plan), event),
    OPEN_SEARCH_PANE: event => this.keyCommandWrapper(() => this.setState({ openPane: paneTypes.SEARCH }), event),
    OPEN_REQUIREMENTS_PANE: event => this.keyCommandWrapper(() => this.setState({ openPane: paneTypes.REQUIREMENTS }), event),
    OPEN_BOOKMARKS_PANE: event => this.keyCommandWrapper(() => this.setState({ openPane: paneTypes.BOOKMARKS }), event),
  };

  constructor(props) {
    super(props);
    this.state = {
      noPlan: true,
      openPane: paneTypes.REQUIREMENTS,
      isEditing: false,
      tempPlanName: '',
    };

    this.setCurrentPlan = this.setCurrentPlan.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.createNewPlan = this.createNewPlan.bind(this);
    this.showNewPlanDialog = this.showNewPlanDialog.bind(this);
    this.getFlattenedCourses = this.getFlattenedCourses.bind(this);
    this.addCourseToTerm = this.addCourseToTerm.bind(this);
    this.removeCourseFromTerm = this.removeCourseFromTerm.bind(this);
    this.props.getTimes();

    this.dplanref = React.createRef();
    this.props.updateCloseFocus(this.dplanref);

    // Prevents locking of plan on resize
    if (this.props.plan !== null) this.state.noPlan = false;
  }

  componentDidMount() {
    this.dplanref.current.focus();
    if (this.props.plan) this.setPreviousCourses();
  }


  setCurrentPlan(planID) {
    if (planID !== null) {
      console.log(`setting plan to ${planID}`);
      this.props.fetchPlan(planID).then(() => {
        this.setState({
          noPlan: false,
          tempPlanName: this.props.plan.name,
        });
      });
    } else {
      console.log('resetting to no plan');
      this.setState({ noPlan: true });
    }
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
  setAllFulfilledStatus = (termID, userCourseID) => {
    try {
      this.getFlattenedTerms().forEach((term) => {
        if (term._id === termID) {
          const previousCourses = this.getFlattenedTerms().filter((t) => {
            return t.index <= term.index;
          }).map((t) => {
            return t.previousCourses;
          }).flat()
            .map((t) => { return t.toString(); });
          const prevCourses = [...new Set((this.props.user.placement_courses && this.props.user.placement_courses.length)
            ? this.props.user.placement_courses.map((c) => { return c._id.toString(); }).concat(previousCourses)
            : previousCourses)];

          this.getFlattenedCourses().forEach((userCourse) => {
            if (userCourse.id === userCourseID) {
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
              this.props.setFulfilledStatus(userCourse.id, getValue(userCourse));
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
          return (c.fulfilledStatus === '' && !c.placeholder && c.course !== null);
        })
        .map((c) => {
          return (c.course.xlist.length) ? [...c.course.xlist.map(xlist => xlist._id), c.course.id] : c.course.id;
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
              x.courses.filter((c) => {
                return (c.fulfilledStatus === '' && !c.placeholder && c.course !== null);
              }).forEach((course) => {
                console.log('SETFULFILLEDSTATUS', course.course.name);
                this.setAllFulfilledStatus(x._id, course.id);
              });
            }
          });
      });
    });
  }

  handleChangePlanName = (e) => {
    this.setState({ isEditing: false });
    this.props.updatePlan({ name: this.state.tempPlanName }, this.props.plan.id).then(() => this.props.fetchPlan().then(() => this.setState({ tempPlanName: this.props.plan.name })));
  }

  addCourseToTerm = (course, term) => new Promise((resolve, reject) => {
    console.log('[DPLAN.js] We got request to add course to term');
    try {
      this.props.plan.terms.forEach((y) => {
        y.forEach((t) => {
          if (t._id === term._id) {
            axios.post(`${ROOT_URL}/terms/${term.id}/course`, { courseID: course.id }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }).then((response) => {
              this.props.addCourseToTerm(response.data, term._id).then(() => {
                this.setPreviousCourses();
                resolve();
              });
            });
          }
        });
      });
    } catch (e) {
      reject(e);
    }
  })

  removeCourseFromTerm = (userCourseID, termID) => new Promise((resolve, reject) => {
    console.log('[DPLAN.js] We got request to remove course from term');
    console.log(userCourseID, termID);
    try {
      this.props.plan.terms.forEach((y) => {
        y.forEach((t) => {
          if (t._id === termID) {
            axios.delete(`${ROOT_URL}/terms/${termID}/course/${userCourseID}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }).then(() => {
              this.props.removeCourseFromTerm(userCourseID).then(() => {
                console.log('[DPLAN.js]', this.props.plan.terms);
                // Set Previous Courses for Each Term here
                this.setPreviousCourses();
                resolve();
              });
            });
          }
        });
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  })

  addPlaceholderCourseToTerm = (department, term) => new Promise((resolve, reject) => {
    console.log('[DPLAN.js] We got request to add placeholder course to term');
    try {
      this.props.plan.terms.forEach((y) => {
        y.forEach((t) => {
          if (t._id === term._id) {
            axios.post(`${ROOT_URL}/terms/${term.id}/course/placement`, { department }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }).then((response) => {
              this.props.addPlaceholderCourse(department, term._id);
              resolve();
            });
          }
        });
      });
    } catch (e) {
      reject(e);
    }
  })

  removePlaceholderCourseFromTerm = (department, termID) => new Promise((resolve, reject) => {
    console.log('[DPLAN.js] We got request to remove placeholder course from term');
    try {
      this.props.plan.terms.forEach((y) => {
        y.forEach((t) => {
          if (t._id === termID) {
            axios.delete(`${ROOT_URL}/terms/${termID}/course/placement/${department}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }).then(() => {
              console.log('DEPARTMENT to remove', department);
              this.props.removePlaceholderCourse(department, termID);
              resolve();
            });
          }
        });
      });
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
  })

  deletePlanKeyPress(plan) {
    if (this.props.plan !== null) {
      console.log('deletePlanKeyPress');
      if (plan === null) {
        console.log('plan is null');
      } else {
        this.showDialog();
      }
    }
  }

  keyCommandWrapper(fn, event = null) {
    event.preventDefault();
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  }

  showDialog() {
    if (!this.props.openDialog) {
      const opts = {
        title: `Delete ${this.props.plan.name === '' ? 'Plan' : ` '${this.props.plan.name.length > 10 ? (`${this.props.plan.name.substring(0, 7)}...`) : this.props.plan.name}'`}?`,
        okText: 'Delete',
        onOk: () => {
          this.props.deletePlan(this.props.plan.id, this.props.history);
        },
      };
      this.props.showDialog(DialogTypes.DELETE_PLAN, opts);
    }
  }

  showNewPlanDialog() {
    if (!this.props.openDialog) {
      const dialogOptions = {
        title: 'Name your plan',
        okText: 'Create',
        onOk: (name) => {
          this.createNewPlan(name);
        },
      };
      this.props.showDialog(DialogTypes.NEW_PLAN, dialogOptions);
    }
  }

  createNewPlan(name) {
    const terms = ['F', 'W', 'S', 'X'];
    this.props.fetchUser().then(() => { // grabs most recent user data first
      let currYear = this.props.user.graduationYear - 4;
      let currQuarter = -1;
      console.log(`creating new plan with name ${name}`);
      this.props.createPlan({
        terms: emptyPlan.terms.map((term) => {
          if (currQuarter === 3) currYear += 1;
          currQuarter = (currQuarter + 1) % 4;
          return { ...term, year: currYear, quarter: terms[currQuarter] };
        }),
        name,
      }, this.setCurrentPlan).then(() => {
        this.props.fetchPlans();
      });
    });
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
        <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
          <div className="dashboard" tabIndex={-1} ref={this.dplanref}>
            <Dashboard setCurrentPlan={this.setCurrentPlan} />
            <div className="welcome-text">
              <div className="welcome-title">Welcome to D-Planner!</div>
              <div className="welcome-subtitle">Get started by creating a new Plan.</div>
            </div>
          </div>
        </HotKeys>
      );
    } else {
      return (
        <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
          <div className="dashboard" tabIndex={-1} ref={this.dplanref}>
            <Dashboard setCurrentPlan={this.setCurrentPlan} />
            <div className="plan-content">
              <div className="plan-side">
                <div className="plan-header">
                  {this.state.isEditing
                    ? (
                      <>
                        <input className="plan-name plan-name-editing" placeholder={this.state.tempPlanName} value={this.state.tempPlanName} onChange={e => this.setState({ tempPlanName: e.target.value })} />
                        <img className="plan-name-check" src={check} alt="check" onClick={this.handleChangePlanName} />
                      </>
                    )
                    : <div className="plan-name" role="button" tabIndex={-1} onClick={() => this.setState({ isEditing: true })}>{this.renderPlanName(this.props.plan.name)}</div>}
                  <button type="button" className="settings-button" onClick={this.showDialog}>
                    <img src={trash} alt="" />
                  </button>
                </div>
                <Sidebar className="sidebar"
                  setOpenPane={pane => this.setState({ openPane: pane })}
                  openPane={this.state.openPane}
                  planCourses={this.getFlattenedCourses()}
                  setDraggingFulfilledStatus={this.setDraggingFulfilledStatus}
                  addPlaceholderCourse={this.addPlaceholderCourseToTerm}
                  removePlaceholderCourse={this.removePlaceholderCourseFromTerm}
                />
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
                            addPlaceholderCourse={this.addPlaceholderCourseToTerm}
                            removePlaceholderCourse={this.removePlaceholderCourseFromTerm}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </HotKeys>
      );
    }
  }
}

const mapStateToProps = state => ({
  plans: state.plans.all,
  plan: state.plans.current,
  time: state.time,
  user: state.user.current,
  focusElement: state.dialog.focusOnClose,
  openDialog: state.dialog.type,
});

export default withRouter(connect(mapStateToProps, {
  fetchPlan,
  deletePlan,
  addCourseToTerm,
  removeCourseFromTerm,
  showDialog,
  getTimes,
  createPlan,
  setDraggingFulfilledStatus,
  fetchUser,
  fetchPlans,
  updateCloseFocus,
  updatePlan,
  sendVerifyEmail,
  setFulfilledStatus,
  addPlaceholderCourse,
  removePlaceholderCourse,
})(DPlan));
