import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  deletePlan, fetchPlan, fetchBucket, updateTerm,
} from '../../actions';
import Bucket from '../../components/bucket';
import Term from '../../components/term';
import Modal from '../../components/modal';
import './dplan.scss';

class DPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };

    this.onModalSubmit = this.onModalSubmit.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.addCourseToTerm = this.addCourseToTerm.bind(this);
    this.removeCourseFromTerm = this.removeCourseFromTerm.bind(this);
  }

  componentDidMount() {
    this.props.fetchPlan(this.props.match.params.id);
    this.props.fetchBucket();
  }

  onModalSubmit() {
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

  removeCourseFromTerm(course, term) {
    term.courses = term.courses.filter(c => c.id !== course.id);
    this.props.updateTerm(term).then(() => {
      this.props.fetchPlan(this.props.plan.id);
    }).catch((err) => {
      console.log(err);
    });
  }

  showModal() {
    this.setState({
      showModal: true,
    });
  }

  hideModal() {
    this.setState({
      showModal: false,
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
          <Modal show={this.state.showModal} handleClose={this.onModalSubmit} text="Delete">
            <p>Are you sure you want to delete this plan?</p>
          </Modal>
          <button type="button" className="delete-button" onClick={this.showModal}>Delete Plan</button>
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
          <Bucket className="bucket" bucket={this.props.bucket || []} />
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
  fetchPlan, deletePlan, fetchBucket, updateTerm,
})(DPlan));
