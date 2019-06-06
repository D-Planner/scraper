import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  deletePlan, fetchPlan, addCourseToTerm, removeCourseFromTerm, showDialog,
} from '../../actions';
import { DialogTypes } from '../../constants';
import Sidebar from '../sidebar';
import Term from '../../components/term';
import './dplan.scss';

/** Contains one of a user's plans, with all available terms and a sidebar with other information */
class DPlan extends Component {
  constructor(props) {
    super(props);

    this.showDialog = this.showDialog.bind(this);
    this.addCourseToTerm = this.addCourseToTerm.bind(this);
    this.removeCourseFromTerm = this.removeCourseFromTerm.bind(this);
  }

  componentDidMount() {
    this.props.fetchPlan(this.props.match.params.id);
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

  addCourseToTerm(course, term) {
    this.props.addCourseToTerm(course, term).then(() => {
      this.props.fetchPlan(this.props.plan.id);
    }).catch((err) => {
      console.log(err);
    });
  }

  removeCourseFromTerm(course, term) {
    this.props.removeCourseFromTerm(course, term).then(() => {
      this.props.fetchPlan(this.props.plan.id);
    }).catch((err) => {
      console.log(err);
    });
  }

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

  render() {
    if (!this.props.plan) {
      return (<div />);
    }

    return (
      <div className="dplan-page">
        <div className="plan-header">
          <div className="header-left">
            <h1 className="plan-name">{this.props.plan.name}</h1>
          </div>
          <button type="button" className="delete-button" onClick={this.showDialog}>Delete Plan</button>
        </div>
        <div className="plan-content">
          <Sidebar className="sidebar" planCourses={this.getFlattenedCourses()} />
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

const mapStateToProps = state => ({
  plan: state.plans.current,
});

export default withRouter(connect(mapStateToProps, {
  fetchPlan, deletePlan, addCourseToTerm, removeCourseFromTerm, showDialog,
})(DPlan));
