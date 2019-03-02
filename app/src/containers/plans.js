import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Button, Dialog, Pane } from 'evergreen-ui';

import { emptyPlan } from '../services/empty_plan';
import { fetchPlans, createPlan } from '../actions';
import noPlan from '../style/no-plan.png';
import '../style/planPage.css';

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

  renderPlans() {
    return (
      this.props.plans.map((plan) => {
        return (
          <div>
            <Link to={`/plan/${plan.normalizedName}`} key={plan.id}>{plan.name}</Link>
          </div>
        );
      })
    );
  }

  render() {
    return (
      <div>
        {this.props.plans.length === 0
          ? (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
              >
                <img src={noPlan}
                  alt=""
                  style={{
                    width: '200px',
                    height: '200px',
                    marginTop: '100px',
                  }}
                />
                <p style={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  lineHeight: 'normal',
                  fontSize: '18px',
                  textAlign: 'center',
                  color: '#000000',
                  width: '350px',
                  marginTop: '20px',
                }}
                >
          Oh no! Looks like you don’t have any plans yet.
          Click below to get started with your first plan.
                </p>
              </div>
            </div>
          )
          : <div>{this.renderPlans()}</div>}
        <Pane style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginTop: '20px',
        }}
        >
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
          <Button id="planButton" onClick={this.showDialog}>
            {this.props.plans.length === 0
              ? 'Start Now!' : 'New Plan' }
          </Button>
        </Pane>
      </div>


    );
  }
}

const mapStateToProps = state => ({ plans: state.plans.all });

export default withRouter(connect(mapStateToProps, { fetchPlans, createPlan })(Plans));
