import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  fetchPlans, createPlan, deletePlan, showDialog,
} from '../../actions';
import { emptyPlan } from '../../services/empty_plan';
import Plans from '../../components/plans';
import { DialogTypes } from '../../constants';

import './dashboard.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.createNewPlan = this.createNewPlan.bind(this);
    this.removePlan = this.removePlan.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.goToPlan = this.goToPlan.bind(this);
  }

  componentWillMount() {
    this.props.fetchPlans();
  }

  createNewPlan(name) {
    emptyPlan.name = name;
    this.props.createPlan(emptyPlan, this.props.history);
  }

  removePlan(event, id) {
    event.stopPropagation();
    const opts = {
      title: 'Delete Plan',
      okText: 'Delete',
      onOk: () => {
        this.props.deletePlan(id, this.props.history);
      },
    };
    this.props.showDialog(DialogTypes.DELETE_PLAN, opts);
  }

  goToPlan(id) {
    this.props.history.push(`/plan/${id}`);
  }

  showDialog() {
    const dialogOptions = {
      title: 'Name your plan',
      okText: 'Create',
      onOk: (name) => {
        this.createNewPlan(name);
      },
    };
    this.props.showDialog(DialogTypes.NEW_PLAN, dialogOptions);
  }

  render() {
    return (
      <div className="dashboard-container">
        <Plans plans={this.props.plans} goToPlan={this.goToPlan} showDialog={this.showDialog} deletePlan={this.removePlan} />
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
