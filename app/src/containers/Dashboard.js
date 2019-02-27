import React from 'react';
import {
  Pane, Button, Dialog,
} from 'evergreen-ui';
import '../style/dash.css';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchPlans } from '../actions/index';
import { emptyPlan } from '../services/empty_plan';


class Dashboard extends React.Component {
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

  componentWillMount() {
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
    if (this.props.plans.length <= 0) {
      return <div />;
    }
    return (
      <Pane className="planPane"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {this.props.plans.map((plan) => {
          return (
            <Link to={`/plan/${plan.normalizedName}`} key={plan.id}>
              <Pane className="plan"
                display="flex"
                background="tint2"
                borderRadius={3}
              >
                {plan.name}
              </Pane>
            </Link>
          );
        })}
      </Pane>
    );
  }

  render() {
    let content = [];
    content = (
      <div>
        <Pane style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
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
          <h4 id="myPlans">MY PLANS</h4>
          <Button id="newPlanButton"
            height={32}
            style={{
              margin: '30px',
            }}
          >
            New Plan
          </Button>
        </Pane>
        {this.renderPlans()}
      </div>
    );

    return (
      <div>
        {content}
      </div>
    );
  }
}

const mapStateToProps = state => ({ plans: state.plans.all });

export default withRouter(connect(mapStateToProps, { fetchPlans })(Dashboard));
