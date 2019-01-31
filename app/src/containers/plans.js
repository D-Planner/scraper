import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchPlans } from '../actions';

class Plans extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    console.log(this.props);
    this.props.fetchPlans();
  }

  render() {
    if (this.props.plans.length === 0) {
      return (
        <div>{'You don\'t have any plans yet :('}</div>
      );
    }

    return (
      <div>
        {this.props.plans.map((plan) => {
          return (
            <div>
              plan.name
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { plans: state.plans.all };
};

export default connect(mapStateToProps, { fetchPlans })(Plans);
