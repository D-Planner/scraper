import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';

import { emptyPlan } from '../services/empty_plan';
import { fetchPlans, createPlan } from '../actions';

class Plans extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.createNewPlan = this.createNewPlan.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    this.props.fetchPlans();
  }

  createNewPlan() {
    this.props.createPlan(emptyPlan, this.props.history);
  }

  render() {
    if (this.props.plans.length === 0) {
      return (
        <div>
          <div>
            {'You don\'t have any plans yet :('}
          </div>
          <div>
            <Button color="primary" onClick={this.createNewPlan}>New Plan</Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        {this.props.plans.map((plan) => {
          return (
            <div>
              {plan.name}
            </div>
          );
        })}
        <div>
          <Button color="primary" onClick={this.createNewPlan}>New Plan</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { plans: state.plans.all };
};

export default withRouter(connect(mapStateToProps, { fetchPlans, createPlan })(Plans));
