import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Dialog,
} from 'evergreen-ui';
import { withRouter } from 'react-router-dom';
import {
  deletePlan, fetchPlan, fetchBucket, updateTerm,
} from '../../actions';
import Bucket from '../../components/bucket/bucket';
import Term from '../../components/term';
import './dplan.scss';

class DPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDialog: false,
    };

    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.addCourseToTerm = this.addCourseToTerm.bind(this);
  }

  componentDidMount() {
    this.props.fetchPlan(this.props.match.params.id);
    this.props.fetchBucket();
  }

  onDialogSubmit() {
    this.props.deletePlan(this.props.plan.id, this.props.history);
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

  showDialog() {
    this.setState({
      showDialog: true,
    });
  }

  hideDialog() {
    this.setState({
      showDialog: false,
    });
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
          <Dialog
            isShown={this.state.showDialog}
            title="Delete Plan?"
            onConfirm={this.onDialogSubmit}
            onCancel={this.hideDialog}
            confirmLabel="Delete"
            intent="danger"
          />
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
          <Bucket className="bucket" bucket={this.props.bucket} />
          <div className="plan-grid">
            {this.props.plan.terms.map((year) => {
              return (
                <div className="plan-row" key={year[0].id}>
                  {year.map((term) => {
                    return (
                      <Term term={term} key={term.id} addCourseToTerm={this.addCourseToTerm} />
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
  fetchPlan, deletePlan, fetchBucket, updateTerm,
})(DPlan));
