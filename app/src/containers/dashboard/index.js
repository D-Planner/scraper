import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  fetchPlans, createPlan, deletePlan, showDialog,
} from '../../actions';
import { emptyPlan } from '../../services/empty_plan';
import Modal from '../../components/modal';
import Plans from '../../components/plans';
import { DialogTypes } from '../../constants';

import './dashboard.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      newPlanName: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.createNewPlan = this.createNewPlan.bind(this);
    this.removePlan = this.removePlan.bind(this);
    this.showModal = this.showModal.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  componentWillMount() {
    this.props.fetchPlans();
  }

  onInputChange(event) {
    this.setState({
      newPlanName: event.target.value,
    });
  }

  handleSubmit(event) {
    this.createNewPlan(event);
  }

  createNewPlan(event) {
    emptyPlan.name = this.state.newPlanName;
    this.props.createPlan(emptyPlan, this.props.history);
  }

  removePlan(event) {
    this.props.deletePlan(event.target.value, this.props.history);
  }

  showModal(event) {
    this.props.showDialog(DialogTypes.NEW_PLAN);
  }

  renderPlans() {
    return (
      this.props.plans.map((plan) => {
        return (
          <div className="plan-container">
            <Link to={`/plan/${plan.id}`} key={plan.id}>
              <p>{plan.name}</p>
            </Link>
            <div className="delete-button-container">
              <button type="button" value={plan.id} onClick={this.removePlan}>Delete Plan</button>
            </div>
          </div>
        );
      })
    );
  }

  render() {
    return (
      <div className="dashboard-container">
        <Plans plans={this.props.plans} showModal={this.showModal} deletePlan={this.removePlan} />
        <Modal show={this.state.show} handleClose={this.handleSubmit} text="Create">
          <p>Name your new plan</p>
          <input type="text" onChange={this.onInputChange} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  plans: state.plans.all,
});

export default withRouter(connect(mapStateToProps, {
  fetchPlans, createPlan, deletePlan, showDialog,
})(Dashboard));
