import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchPlans, createPlan } from '../../actions/index';
import { emptyPlan } from '../../services/empty_plan';
import './dashboard.scss';
import noPlansImg from '../../style/no-plans.png';

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
    return (
      <div>
        {this.props.plans.length > 0
          ? this.props.plans.map((plan) => {
            return (
              <Link to={`/plan/${plan.id}`} key={plan.id}>
                <div>{plan.name}</div>
              </Link>
            );
          })
          : (
            <div>
              <img src={noPlansImg} alt="No Plans" />
              <p>
                {'Oh No! Looks like you don\'t have any plans yet. Click the "New Plan" button to get started with your first plan.'}
              </p>
            </div>
          )
        }
      </div>
    );
  }

  render() {
    let content = [];
    content = (
      <div>
        <div>
          <div
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
          </div>
          <h4 id="myPlans">MY PLANS</h4>
          <button type="button" id="newPlanButton" onClick={this.showDialog}>
            <p>New Plan</p>
          </button>
        </div>
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

const mapStateToProps = state => ({
  plans: state.plans.all,
});

export default withRouter(connect(mapStateToProps, { fetchPlans, createPlan })(Dashboard));
