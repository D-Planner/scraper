import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import axios from 'axios';
import ReactGA from 'react-ga';
import { HotKeys } from 'react-hotkeys';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
  deletePlan, fetchPlan, addCourseToTerm, removeCourseFromTerm, showDialog, getTimes, createPlan, duplicatePlan, setDraggingFulfilledStatus, getCurrentAnnouncement, getAnnouncement, updateAnnouncement, newAnnouncement, deleteAnnouncement, deleteAllAnnouncements, updateUser, fetchUser, fetchPlans, updateCloseFocus, updatePlan, sendVerifyEmail, setFulfilledStatus, setLoading, addPlaceholderCourse, removePlaceholderCourse, disableCurrentAnnouncement,
} from '../../actions';
import {
  DialogTypes, ROOT_URL, consoleLogging, metaContentSeparator, universalMetaTitle, errorLogging,
} from '../../constants';
import Sidebar, { paneTypes } from '../sidebar';
import Dashboard from '../dashboard';
import close from '../../style/close-white.svg';
import settings from '../../style/settings.svg';
import check from '../../style/check.svg';
import logo from '../../style/logo.svg';
import Term from '../term';
import './dplan.scss';


const [ERROR, WARNING, CLEAR] = ['error', 'warning', ''];

const arraysMatch = (a1, a2) => {
  if (a1.length !== a2.length) return false;
  for (let i = 0; i < a1.length; i += 1) {
    if (a1[i] !== a2[i]) return false;
  }
  return true;
};

const loggingErrorsInDplan = (e) => {
  errorLogging('app/src/containers/dplan.js', e);
};

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
    OPEN_NEW_PLAN: event => this.keyCommandWrapper(() => this.showNewPlanDialog(), event),
    OPEN_DELETE_PLAN: event => this.keyCommandWrapper(() => this.deletePlanKeyPress(this.props.plan), event),
    OPEN_SEARCH_PANE: event => this.keyCommandWrapper(() => this.setState({ openPane: paneTypes.SEARCH }), event),
    OPEN_REQUIREMENTS_PANE: event => this.keyCommandWrapper(() => this.setState({ openPane: paneTypes.REQUIREMENTS }), event),
    OPEN_BOOKMARKS_PANE: event => this.keyCommandWrapper(() => this.setState({ openPane: paneTypes.BOOKMARKS }), event),
  };

  constructor(props) {
    super(props);
    this.state = {
      openPane: paneTypes.REQUIREMENTS,
      isEditing: false,
      loadingPlan: false,
      tempPlanName: '',
      anchorEl: null,
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
  }

  componentWillMount() {
    this.props.fetchUser().then((user) => {
      ReactGA.set({
        userId: user.id,
      });
      this.props.getCurrentAnnouncement().then(() => {
        if (!this.props.currentAnnouncement || this.props.user.viewed_announcements.indexOf(this.props.currentAnnouncement._id) !== -1) { // && this.props.currentAnnouncement.show_on_open === false)
          this.props.disableCurrentAnnouncement();
        }
      }).catch((e) => {
        loggingErrorsInDplan(e);
      });
    });
  }

  componentDidMount = () => {
    consoleLogging('DPlan', '[DPlan] Did Mount');

    // Checks if there is a current announcement and whether the user has seen it
    this.dplanref.current.focus();
    this.props.setLoading(false);
    if (this.props.plan) this.setPreviousCourses();
  }

  componentWillUpdate = (prevProps) => {
    consoleLogging('DPlan', '[DPlan] Will Update');
    if ((this.props.user.placement_courses && prevProps.user.placement_courses && !arraysMatch(this.props.user.placement_courses.map(c => c.id.toString()), prevProps.user.placement_courses.map(c => c.id.toString())))
    ) {
      consoleLogging('DPlan', '[DPlan] calling setPreviousCourses() in componentWillUpdate');
      this.setPreviousCourses();
    }
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    consoleLogging('DPlan', '[DPlan] Did Update');
    if (prevState.noPlan && !this.state.noPlan) {
      consoleLogging('DPlan', '[DPlan] calling setPreviousCourses() in componentDidUpdate');
      this.setPreviousCourses();
    }
  }

  setCurrentPlan = (planID) => {
    consoleLogging('DPlan', '[DPlan] setCurrentPlan() starting.');

    if (planID !== null) {
      this.setState({ loadingPlan: true });
      this.props.fetchPlan(planID).then(() => {
        this.setState({
          loadingPlan: false,
        });
        consoleLogging('DPlan', '[DPlan] setCurrentPlan() fetched plan from backend.');
        this.setState({
          tempPlanName: this.props.plan.name,
        });
        this.setPreviousCourses();
      });
    } else {
      consoleLogging('DPlan', '[DPlan] setCurrentPlan() resetting to no plan.');
      this.setState({ noPlan: true });
      this.props.fetchPlan(null);
    }
  }

  getFlattenedCourses = () => {
    try {
      const courses = [];
      this.props.plan.terms.forEach((year) => {
        year.forEach((term) => {
          courses.push(...term.courses.filter(c => !c.placeholder));
        });
      });
      return courses;
    } catch (e) {
      loggingErrorsInDplan(e);
      return [];
    }
  }

  getFlattenedTerms = () => {
    try {
      const terms = [];
      this.props.plan.terms.forEach((y) => {
        y.forEach((term) => {
          terms.push(term);
        });
      });
      return terms;
    } catch (e) {
      loggingErrorsInDplan(e);
      return [];
    }
  }

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
              this.props.setFulfilledStatus(userCourseID, getValue(userCourse));
            }
          });
        }
      });
    } catch (e) {
      loggingErrorsInDplan(e);
    }
  };


  setPreviousCourses = () => {
    consoleLogging('DPlan', '[DPlan] setPreviousCourses() starting.');

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
        .filter((c) => {
          return !c.placeholder;
        })
        .map((c) => {
          try {
            return (c.course.xlist.length) ? [...c.course.xlist.map(xlist => xlist._id), c.course.id] : c.course.id;
          } catch (e) {
            loggingErrorsInDplan(e);
            return c.course.id;
          }
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
              x.courses.filter(c => !c.placeholder).forEach((course) => {
                this.setAllFulfilledStatus(x._id, course.id);
              });
            }
          });
      });
    });
  }

  handleChangePlanName = () => {
    this.setState({ isEditing: false });
    this.props.updatePlan({ name: this.state.tempPlanName }, this.props.plan.id).then(() => this.props.fetchPlan(this.props.plan.id).then(() => this.setState({ tempPlanName: this.props.plan.name })));
  }

  addCourseToTerm = (course, term) => new Promise((resolve, reject) => {
    consoleLogging('DPlan', '[DPLAN.js] addCourseToTerm() starting.');
    try {
      this.props.plan.terms.forEach((y) => {
        y.forEach((t) => {
          if (t._id === term._id) {
            axios.post(`${ROOT_URL}/terms/${term.id}/course`, { courseID: course.id }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }).then((response) => {
              consoleLogging('DPlan', `[DPlan] addCourseToTerm() finished call to backend to add course ${course.id} to term.`);
              this.props.addCourseToTerm(response.data, term._id).then(() => {
                consoleLogging('DPlan', `[DPlan] addCourseToTerm() updated redux with new course ${course.id} added to the term.`);
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
    consoleLogging('DPlan', '[DPlan] removeCourseFromTerm() starting.');
    try {
      this.props.plan.terms.forEach((y) => {
        y.forEach((t) => {
          if (t._id === termID) {
            axios.delete(`${ROOT_URL}/terms/${termID}/course/${userCourseID}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }).then(() => {
              consoleLogging('DPlan', `[DPlan] addCourseToTerm() finished call to backend to remove userCourse ${userCourseID} from term.`);
              this.props.removeCourseFromTerm(userCourseID).then(() => {
                consoleLogging('DPlan', `[DPlan] addCourseToTerm() updated redux to remove userCourse ${userCourseID} from the term.`);
                this.setPreviousCourses();
                resolve();
              });
            });
          }
        });
      });
    } catch (e) {
      loggingErrorsInDplan(e);
      reject(e);
    }
  })

  addPlaceholderCourseToTerm = (department, term) => new Promise((resolve, reject) => {
    consoleLogging('DPlan', '[DPlan] addPlaceholderCourseToTerm() starting.');
    try {
      this.props.plan.terms.forEach((y) => {
        y.forEach((t) => {
          if (t._id === term._id) {
            axios.post(`${ROOT_URL}/terms/${term.id}/course/placeholder`, { department }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }).then(() => {
              consoleLogging('DPlan', `[DPlan] addPlaceholderCourseToTerm() finished call to backend to add ${department} placeholder to term.`);
              this.props.addPlaceholderCourse(department, term._id);
              resolve();
            });
          }
        });
      });
    } catch (e) {
      loggingErrorsInDplan(e);
      reject(e);
    }
  })

  removePlaceholderCourseFromTerm = (department, termID) => new Promise((resolve, reject) => {
    consoleLogging('DPlan', '[DPlan] removePlaceholderCourseFromTerm() starting.');
    try {
      axios.delete(`${ROOT_URL}/terms/${termID}/course/placeholder/${department}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(() => {
        consoleLogging('DPlan', `[DPlan] removePlaceholderCourseFromTerm() finished call to backend to remove ${department} placeholder from term.`);
        this.props.removePlaceholderCourse(department, termID);
        resolve();
      });
    } catch (e) {
      loggingErrorsInDplan(e);
      reject(e);
    }
  })

  // addCourseToPlacements = courseID => new Promise((resolve, reject) => {
  //   // console.log('[DPLAN.js] We got a request to add a placement course');
  //   try {
  //     axios.post(`${ROOT_URL}/courses/placement/${courseID}`, {}, {
  //       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  //     }).then((response) => {
  //       this.setPreviousCourses();
  //       resolve();
  //     }).catch((error) => {
  //       reject();
  //     });
  //   } catch (e) {
  //     loggingErrorsInDplan(e);
  //     reject(e);
  //   }
  // })

  setDraggingFulfilledStatus = courseID => new Promise((resolve, reject) => {
    // console.log('[DPLAN.js] We got request to set Dragging Status for', courseID);
    // this.props.setDraggingFulfilledStatus(this.props.plan.id, courseID).then(() => {
    //   resolve();
    // }).catch((e) => {
    //   loggingErrorsInDplan(e);
    //   reject();
    // });
  })

  setMenuAnchor = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  duplicatePlan = () => {
    this.props.duplicatePlan(this.props.plan.id, this.setCurrentPlan).then(() => {
      this.props.fetchPlans();
    });
  }

  deletePlanKeyPress = (plan) => {
    if (this.props.plan !== null) {
      if (plan !== null) {
        this.showDialog();
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  keyCommandWrapper = (fn, event = null) => {
    event.preventDefault();
    try {
      fn();
    } catch (e) {
      loggingErrorsInDplan(e);
    }
  }

  showDialog = () => {
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

  showNewPlanDialog = () => {
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

  createNewPlan = (name) => {
    this.props.createPlan({
      name,
    }, this.setCurrentPlan).then(() => {
      this.props.fetchPlans();
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
    } else if (planName.length === 0) {
      return 'Untitled';
    } else {
      return planName;
    }
  };

  renderAnnouncement = () => {
    if (this.props.user !== {}) {
      return (
        <div className={`announcements${this.props.announcementActive === true ? '' : ' closed'}${this.props.currentAnnouncement.link === '/' ? '' : ' clickable'}`}>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div className="announcement-text"
            onClick={(e) => {
              if (this.props.currentAnnouncement) {
                this.props.history.push(this.props.currentAnnouncement.link);
                if (this.props.currentAnnouncement.link !== '/') {
                  this.props.updateAnnouncement(this.props.currentAnnouncement._id, { times_clicked: this.props.currentAnnouncement.times_clicked + 1 });
                  this.props.updateUser({ viewed_announcements: this.props.currentAnnouncement._id }).then(() => {
                    this.props.disableCurrentAnnouncement();
                  });
                }
              }
            }}
          >{(this.props.currentAnnouncement && this.props.announcementActive === true) ? this.props.currentAnnouncement.text : ''}
          </div>
          <img src={close}
            alt="close"
            className="close"
            onClick={(e) => {
              this.props.updateUser({ viewed_announcements: this.props.currentAnnouncement._id }).then(() => {
                this.props.disableCurrentAnnouncement();
              });
            }}
          />
        </div>
      );
    } else return null;
  }

  render() {
    if (!this.props.plan) {
      return (
        <div className="announcement-container">
          <Helmet>
            <title>Dashboard{metaContentSeparator}{universalMetaTitle}</title>
          </Helmet>
          <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
            {this.renderAnnouncement()}
            <div className={(this.props.currentAnnouncement && this.props.announcementActive === true) ? 'dashboard announce' : 'dashboard'} tabIndex={-1} ref={this.dplanref}>
              <Dashboard setCurrentPlan={this.setCurrentPlan} showNewPlanDialog={this.showNewPlanDialog} />
              <div className="welcome-text">
                <div className="welcome-title">Welcome to D-Planner!</div>
                <div className="welcome-subtitle">Get started by creating a new Plan.</div>
                <div className="release-notes">
                  New updates!
                  <ul>
                    <li>Search filters now work!</li>
                    <li>We fixed scrolling problems on small screens.</li>
                    <li>You can now click on a course inside another course popup!</li>
                  </ul>
                  Next up:
                  <ul>
                    <li>Able to hide the red prereq checking.</li>
                    <li>Insert your own custom named courses.</li>
                    <li>Fixing slight bug in &quot;My Degree&qout; section.</li>
                  </ul>
                </div>
              </div>
            </div>
          </HotKeys>
        </div>
      );
    } else {
      return (
        <div className="announcement-container">
          <Helmet>
            <title>{this.props.plan.name}{metaContentSeparator}{universalMetaTitle}</title>
            <meta name="description" content="" />
            <meta name="keywords" content="" />
          </Helmet>
          <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
            {this.renderAnnouncement()}
            <div className={this.props.announcementActive === true ? 'dashboard announce' : 'dashboard'} tabIndex={-1} ref={this.dplanref}>
              <Dashboard setCurrentPlan={this.setCurrentPlan} showNewPlanDialog={this.showNewPlanDialog} />
              {this.state.loadingPlan === true
                ? (
                  <div className="loader">
                    <img className="loader-image" src={logo} alt="logo" />
                  </div>
                )
                : (
                  <Fragment>
                    <div className="plan-content">
                      <div className="plan-side">
                        <div className="plan-header">
                          {this.state.isEditing
                            ? (
                              <>
                                <input
                                  className="plan-name plan-name-editing"
                                  placeholder={this.state.tempPlanName}
                                  value={this.state.tempPlanName}
                                  onChange={e => this.setState({ tempPlanName: e.target.value })}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      this.handleChangePlanName();
                                    }
                                  }}
                                />
                                <img className="plan-name-check" src={check} alt="check" onClick={this.handleChangePlanName} />
                              </>
                            )
                            : <div className="plan-name" role="button" tabIndex={-1} onClick={() => this.setState({ isEditing: true })}>{this.renderPlanName(this.props.plan.name)}</div>}
                          <button type="button" className="settings-button" onClick={this.setMenuAnchor}>
                            <img src={settings} alt="" />
                          </button>
                          <Menu
                            className="plan-options"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={Boolean(this.state.anchorEl)}
                            onClose={() => this.setState({ anchorEl: null })}
                          >
                            <MenuItem onClick={() => {
                              this.setState({ anchorEl: null });
                              this.duplicatePlan();
                            }}
                            >Duplicate
                            </MenuItem>
                            <MenuItem onClick={() => {
                              this.setState({ anchorEl: null });
                              this.showDialog();
                            }}
                            >Delete
                            </MenuItem>
                          </Menu>
                        </div>
                        <Sidebar
                          setOpenPane={pane => this.setState({ openPane: pane })}
                          openPane={this.state.openPane}
                          planCourses={this.getFlattenedCourses()}
                          setDraggingFulfilledStatus={this.setDraggingFulfilledStatus}
                          addPlaceholderCourse={this.addPlaceholderCourseToTerm}
                          removePlaceholderCourse={this.removePlaceholderCourseFromTerm}
                          setPreviousCourses={this.setPreviousCourses}
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
                                    setPreviousCourses={this.setPreviousCourses}
                                  />
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Fragment>
                )
              }
            </div>
          </HotKeys>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  plans: state.plans.all,
  plan: state.plans.current,
  time: state.time,
  currentAnnouncement: state.announcements.currentAnnouncement,
  announcementActive: state.announcements.announcementActive,
  user: state.user.current,
  focusElement: state.dialog.focusOnClose,
  openDialog: state.dialog.type,
  loading: state.loading.loading,
});

export default withRouter(connect(mapStateToProps, {
  fetchPlan,
  deletePlan,
  addCourseToTerm,
  removeCourseFromTerm,
  showDialog,
  getTimes,
  createPlan,
  duplicatePlan,
  setDraggingFulfilledStatus,
  fetchUser,
  fetchPlans,
  updateCloseFocus,
  updatePlan,
  setLoading,
  sendVerifyEmail,
  setFulfilledStatus,
  getCurrentAnnouncement,
  getAnnouncement,
  updateAnnouncement,
  newAnnouncement,
  deleteAnnouncement,
  deleteAllAnnouncements,
  updateUser,
  addPlaceholderCourse,
  removePlaceholderCourse,
  disableCurrentAnnouncement,
})(DPlan));
