/* eslint-disable max-len */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  deletePlan, fetchPlan, addCourseToTerm, removeCourseFromTerm, showDialog, getTimes, createPlan, setDraggingFulfilledStatus, getCurrentAnnouncement, getAnnouncement, updateAnnouncement, newAnnouncement, deleteAnnouncement, deleteAllAnnouncements,
} from '../../actions';
import { DialogTypes } from '../../constants';
import { emptyPlan } from '../../services/empty_plan';
import Sidebar from '../sidebar';
import Dashboard from '../dashboard';
// import noPlan from '../../style/no-plan.png';
import trash from '../../style/trash.svg';
import close from '../../style/close-white.svg';
import Term from '../term';
import './dplan.scss';

/** Contains one of a user's plans, with all available terms and a sidebar with other information */
class DPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noPlan: true,
      // announcementActive: true,
    };
    this.setCurrentPlan = this.setCurrentPlan.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.createNewPlan = this.createNewPlan.bind(this);
    this.showNewPlanDialog = this.showNewPlanDialog.bind(this);
    this.getFlattenedCourses = this.getFlattenedCourses.bind(this);
    this.addCourseToTerm = this.addCourseToTerm.bind(this);
    this.removeCourseFromTerm = this.removeCourseFromTerm.bind(this);

    this.props.getTimes();
    this.props.getCurrentAnnouncement();
    // new Promise((resolve, reject) => {
    //   this.props.getCurrentAnnouncement();
    //   resolve();
    // }).then(() => {
    //   console.log('initial update component');
    //   this.props.updateAnnouncement(this.props.currentAnnouncement._id, { times_shown: this.props.currentAnnouncement.times_shown + 1 });
    // });
  }

  componentDidUpdate() {
    console.log('dplan props');
    console.log(this.props);
  }

  setCurrentPlan(planID) {
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

  renderAnnouncement = () => {
    return (
    // this.props.announcements.length > 0
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div className={true && this.props.announcementActive === true ? 'announcements' : 'announcements closed'}
        onClick={(e) => {
          // this.props.announcements.length > 0
          if (this.props.currentAnnouncement) {
            this.props.history.push(this.props.currentAnnouncement.link);
            console.log('current announcement');
            console.log(this.props.currentAnnouncement);
            this.props.updateAnnouncement(this.props.currentAnnouncement._id, { times_clicked: this.props.currentAnnouncement.times_clicked + 1 });
          }
          console.log('Announcement click!');
        }}
      >
        {/* this.props.announcements.length > 0 */}
        <div className="announcement-text">{(this.props.currentAnnouncement && this.props.announcementActive === true) ? this.props.currentAnnouncement.text : ''}</div>
        <img src={close}
          alt="close"
          className="close"
          onClick={(e) => {
            this.setState((prevState) => { return ({ announcementActive: false }); }); // Shouldn't be necessary
            console.log('current announcement');
            console.log(this.props.currentAnnouncement);
            this.props.updateAnnouncement(this.props.currentAnnouncement._id, { enabled: false });
            e.stopPropagation();
          }}
        />
      </div>
    );
  }

  render() {
    if (!this.props.plan || this.state.noPlan) {
      return (
        <div className="announcement-container">
          {this.renderAnnouncement()}
          {/* this.props.announcements.length > 0 */}
          <div className={(this.props.currentAnnouncement && this.props.announcementActive === true) ? 'dashboard announce' : 'dashboard'}>
            <Dashboard setCurrentPlan={this.setCurrentPlan} />
            <div className="welcome-text">
              <div className="welcome-title">Welcome to D-Planner!</div>
              <div className="welcome-subtitle">Get started by creating a new Plan.</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="announcement-container">
          {this.renderAnnouncement()}
          <div className={this.props.announcementActive === true ? 'dashboard announce' : 'dashboard'}>
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
        </div>
      );
    }
  }
}


const mapStateToProps = state => ({
  plans: state.plans.all,
  plan: state.plans.current,
  time: state.time,
  currentAnnouncement: state.announcements.currentAnnouncement, // fetchAnnouncement(id)
  // announcements: state.announcements.announcements,
  announcementActive: state.announcements.announcementActive,
});

export default withRouter(connect(mapStateToProps, {
  fetchPlan, deletePlan, addCourseToTerm, removeCourseFromTerm, showDialog, getTimes, createPlan, setDraggingFulfilledStatus, getCurrentAnnouncement, getAnnouncement, updateAnnouncement, newAnnouncement, deleteAnnouncement, deleteAllAnnouncements,
})(DPlan));
