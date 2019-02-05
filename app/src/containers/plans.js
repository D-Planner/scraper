import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Dialog, Pane } from 'evergreen-ui';

import { emptyPlan } from '../services/empty_plan';
import { fetchPlans, createPlan } from '../actions';

class Plans extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDialog: false,
      newPlanName: '',
    };

    this.createNewPlan = this.createNewPlan.bind(this);
    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchPlans();
  }

  onInputChange(event) {
    this.setState({
      newPlanName: event.target.value,
    });
  }

  onDialogSubmit() {
    this.hideDialog();
    this.createNewPlan();
  }

  createNewPlan() {
    emptyPlan.name = this.state.newPlanName;
    this.props.createPlan(emptyPlan, this.props.history);
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
    let plans = <div />;
    if (this.props.plans.length === 0) {
      plans = <div>{'You don\'t have any plans yet :('}</div>;
    } else {
      plans = (
        <div>
          {this.props.plans.map((plan) => {
            return (
              <div>
                {plan.name}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div>
        <div>
          {plans}
        </div>
        <div>
          <Pane>
            <Dialog
              isShown={this.state.showDialog}
              title="Create New Plan"
              onConfirm={this.onDialogSubmit}
              onCancel={this.hideDialog}
              confirmLabel="Create"
            >
              <input
                type="text"
                placeholder="Name Your Plan"
                onChange={this.onInputChange}
              />
            </Dialog>
            <Button color="primary" onClick={this.showDialog}>New Plan</Button>
          </Pane>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { plans: state.plans.all };
};

export default withRouter(connect(mapStateToProps, { fetchPlans, createPlan })(Plans));
