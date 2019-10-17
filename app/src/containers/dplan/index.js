/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { HotKeys, configure } from 'react-hotkeys';
import {
  deletePlan, fetchPlan, addCourseToTerm, removeCourseFromTerm, showDialog, getTimes, createPlan, setDraggingFulfilledStatus,
} from '../../actions';
import { DialogTypes } from '../../constants';
import { emptyPlan } from '../../services/empty_plan';
import Sidebar, { paneTypes } from '../sidebar';
import Dashboard from '../dashboard';
// import noPlan from '../../style/no-plan.png';
import trash from '../../style/trash.svg';
import Term from '../term';
import './dplan.scss';


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
    // OK: 'Enter',
    CLOSE: 'Escape', // Close all plans
    SAVE: 'Control+s',
    // OPEN_NEW_PLAN: 'Control+p',  // TODO
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
    // OK: this.test,
    CLOSE: event => this.keyCommandWrapper(() => this.setCurrentPlan(null), event),
    SAVE: event => this.keyCommandWrapper(() => alert('D-Planner automatically saves your work!'), event),
    OPEN_NEW_PLAN: event => this.keyCommandWrapper(() => this.showNewPlanDialog(), event),
    // OPEN_DELETE_PLAN: event => this.keyCommandWrapper(() => { if (this.props.plan === null) { console.log('no plan'); } else { this.props.showDialog(); } }),
    OPEN_DELETE_PLAN: event => this.keyCommandWrapper(() => this.deletePlanKeyPress(this.props.plan), event),
    OPEN_SEARCH_PANE: event => this.keyCommandWrapper(() => this.setState({ openPane: paneTypes.SEARCH }), event),
    OPEN_REQUIREMENTS_PANE: event => this.keyCommandWrapper(() => this.setState({ openPane: paneTypes.REQUIREMENTS }), event),
    OPEN_BOOKMARKS_PANE: event => this.keyCommandWrapper(() => this.setState({ openPane: paneTypes.BOOKMARKS }), event),
  };

  constructor(props) {
    super(props);
    this.state = {
      noPlan: true,
      switchPanel: null,
      openPane: paneTypes.REQUIREMENTS,
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

  setCurrentPlan(planID) {
    if (planID !== null) {
      console.log(`setting plan to ${planID}`);
      this.props.fetchPlan(planID);
      this.setState({
        noPlan: false,
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

  addCourseToTerm = (course, term) => new Promise((resolve, reject) => {
    console.log('[DPLAN.js] We got request to add course to term');
    this.props.addCourseToTerm(course, term, this.props.plan.id).then(() => {
      console.log(`[DPLAN.js] The course \n${course.name} has been added to term \n${term.id}`);
      return this.props.fetchPlan(this.props.plan.id);
    }).then(() => {
      console.log('[DPLAN.js] fetched plan');
      resolve();
    }).catch((err) => {
      console.log(err);
      reject();
    });
  })

  removeCourseFromTerm = (course, term) => new Promise((resolve, reject) => {
    this.props.removeCourseFromTerm(course, term, this.props.plan.id).then(() => {
      console.log(`[DPLAN.js] The course \n${course.name} has been removed from term \n${term.id}`);
      return this.props.fetchPlan(this.props.plan.id);
    }).then(() => {
      console.log('[DPLAN.js] fetched plan');
      resolve();
    }).catch((err) => {
      console.log(err);
      reject();
    });
  })

  setDraggingFulfilledStatus = courseID => new Promise((resolve, reject) => {
    this.props.setDraggingFulfilledStatus(this.props.plan.id, courseID).then(() => {
      resolve();
    }).catch((e) => {
      console.log(e);
      reject();
    });
  });

  keyCommandWrapper(fn, event = null) {
    event.preventDefault();
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  }

  showDialog() {
    const opts = {
      title: 'Delete plan',
      okText: 'Delete',
      onOk: () => {
        // for (let i = 0; i < this.props.plans.length; i += 1) {
        //   this.props.deletePlan(this.props.plans[i].id, this.props.history);
        // }
        this.props.deletePlan(this.props.plan.id, this.props.history);
      },
    };
    this.props.showDialog(DialogTypes.DELETE_PLAN, opts);
  }

  // Of interest
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
        <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
          <div className="dashboard">
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
          <div className="dashboard">
            <Dashboard setCurrentPlan={this.setCurrentPlan} />
            <div className="plan-content">
              <div className="plan-side">
                <div className="plan-header">
                  <h1 className="plan-name">{this.renderPlanName(this.props.plan.name)}</h1>
                  <button type="button" className="settings-button" onClick={this.showDialog}>
                    <img src={trash} alt="delete" />
                  </button>
                </div>
                <Sidebar className="sidebar"
                  openPane={this.state.openPane}
                  planCourses={this.getFlattenedCourses()}
                  setDraggingFulfilledStatus={this.setDraggingFulfilledStatus}
                  openPanel={(prevState) => {
                    console.log(this.state.switchPanel);
                    this.setState({ switchPanel: null });
                    return (prevState.switchPanel);
                  }}
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
  pressedKey: state.keyEvent.pressedKey,
  pressedModifier: state.keyEvent.pressedModifier,
});

export default withRouter(connect(mapStateToProps, {
  fetchPlan, deletePlan, addCourseToTerm, removeCourseFromTerm, showDialog, getTimes, createPlan, setDraggingFulfilledStatus,
})(DPlan));
