import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  deletePlan, fetchPlan, addCourseToTerm, removeCourseFromTerm, showDialog,
} from '../../actions';
import { DialogTypes } from '../../constants';
import Sidebar from '../sidebar';
import Dashboard from '../dashboard';
import Term from '../../components/term';
import noPlan from '../../style/no-plan.png';
import './dplan.scss';

/** Contains one of a user's plans, with all available terms and a sidebar with other information */
class DPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noPlan: true,
    };
    this.setCurrentPlan = this.setCurrentPlan.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.addCourseToTerm = this.addCourseToTerm.bind(this);
    this.removeCourseFromTerm = this.removeCourseFromTerm.bind(this);
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
    // console.log('[DPLAN.js] We got request to add course to term');
    this.props.addCourseToTerm(course, term, this.props.plan.id).then(() => {
      // console.log(`[DPLAN.js] The course \n${course.name} has been added to term \n${term.id}`);
      return this.props.fetchPlan(this.props.plan.id);
    }).then(() => {
      // console.log('[DPLAN.js] fetched plan');
      resolve();
    }).catch((err) => {
      console.log(err);
      reject();
    });
  })

  removeCourseFromTerm = (course, term) => new Promise((resolve, reject) => {
    this.props.removeCourseFromTerm(course, term, this.props.plan.id).then(() => {
      // console.log(`[DPLAN.js] The course \n${course.name} has been removed from term \n${term.id}`);
      return this.props.fetchPlan(this.props.plan.id);
    }).then(() => {
      // console.log('[DPLAN.js] fetched plan');
      resolve();
    }).catch((err) => {
      console.log(err);
      reject();
    });
  })

  showDialog() {
    const opts = {
      title: 'Delete Plan',
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


  renderNewPlanButton = (fn) => {
    return (
      <button type="button" className="newPlanButton" id="newPlanButton" onClick={fn}>New Plan</button>
    );
  };

  render() {
    if (!this.props.plan || this.state.noPlan) {
      return (
        <div className="dashboard">
          <Dashboard setCurrentPlan={this.setCurrentPlan} />
          <div className="no-plans">
            <img src={noPlan} alt="" />
            <p>Oh no! Looks like you don’t have any plans yet. Click below to get started with your first plan.</p>
            {this.renderNewPlanButton(this.showNewPlanDialog)}
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
                <h1 className="plan-name">{this.props.plan.name}</h1>
                <button type="button" className="settings-button" onClick={this.showDialog}>+</button>
              </div>
              <Sidebar className="sidebar" planCourses={this.getFlattenedCourses()} />
            </div>
            <div className="plan-grid">
              {this.props.plan.terms.map((year) => {
                return (
                  <div className="plan-row" key={year[0].id}>
                    {year.map((term) => {
                      return (
                        <Term
                          term={term}
                          key={term.id}
                          addCourseToTerm={this.addCourseToTerm}
                          removeCourseFromTerm={this.removeCourseFromTerm}
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
});

export default withRouter(connect(mapStateToProps, {
  fetchPlan, deletePlan, addCourseToTerm, removeCourseFromTerm, showDialog,
})(DPlan));
