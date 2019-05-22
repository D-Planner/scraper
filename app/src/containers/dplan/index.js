import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  deletePlan, fetchPlan, fetchBucket, updateTerm, showDialog,
} from '../../actions';
import { DialogTypes } from '../../constants';
import Bucket from '../../components/bucket';
import Term from '../../components/term';
import Majors from '../majors';
import './dplan.scss';

class DPlan extends Component {
  constructor(props) {
    super(props);

    this.showDialog = this.showDialog.bind(this);
    this.addCourseToTerm = this.addCourseToTerm.bind(this);
    this.removeCourseFromTerm = this.removeCourseFromTerm.bind(this);
  }

  componentDidMount() {
    this.props.fetchPlan(this.props.match.params.id);
    this.props.fetchBucket();
  }

  addCourseToTerm(course, term) {
    term.courses = term.courses.filter(c => c.id !== course.id);
    term.courses.push(course);
    this.props.updateTerm(term).then(() => {
      this.props.fetchPlan(this.props.plan.id);
    }).catch((err) => {
      console.log(err);
    });
  }

  removeCourseFromTerm(course, term) {
    term.courses = term.courses.filter(c => c.id !== course.id);
    this.props.updateTerm(term).then(() => {
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
            <button type="button" className="save-button" onClick={this.savePlan}>
              <p>Save</p>
            </button>
          </div>
          <button type="button" className="delete-button" onClick={this.showDialog}>Delete Plan</button>
        </div>
        <div className="plan-data">
          <p>
              On-Terms:
          </p>
          <p>
              Courses:
          </p>
          <p>
              Distributive Requirements:
          </p>
        </div>
        <div className="plan-content">
          <div>
            <Bucket className="bucket" bucket={this.props.bucket || []} />
            <br />
            <Majors />
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

const mapStateToProps = state => ({
  plan: state.plans.current,
  bucket: state.courses.bucket,
});

export default withRouter(connect(mapStateToProps, {
  fetchPlan, deletePlan, fetchBucket, updateTerm, showDialog,
})(DPlan));
