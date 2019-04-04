import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchPlans, createPlan, deletePlan } from '../../actions/index';
import { emptyPlan } from '../../services/empty_plan';
import Modal from '../../components/modal/modal';
import './dashboard.scss';
import noPlansImg from '../../style/no-plans.png';

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
    this.hideModal = this.hideModal.bind(this);
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
    this.hideModal(event);
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
    this.setState({
      show: true,
    });
  }

  hideModal(event) {
    this.setState({
      show: false,
    });
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
        {this.props.plans.length > 0 ? (
          <div>
            <Modal show={this.state.show} handleClose={this.handleSubmit} text="Create">
              <p>Name your new plan</p>
              <input type="text" onChange={this.onInputChange} />
            </Modal>
            <div className="button-container-secondary">
              <h1 className="table-header">My Plans</h1>
              <button type="button" onClick={this.showModal}>
                <p>New Plan</p>
              </button>
            </div>
            {this.renderPlans()}
          </div>
        ) : (
          <div>
            <h1>My Plans</h1>
            <Modal show={this.state.show} handleClose={this.handleSubmit} text="Create">
              <p>Name your new plan</p>
              <input type="text" onChange={this.onInputChange} />
            </Modal>
            <div className="image-container"><img src={noPlansImg} alt="No Plans" /></div>
            <div className="text-container">
              <p>Oh No! Looks like you don&#39;t have any plans yet. Click the below to get started with your first plan.</p>
            </div>
            <div className="button-container-primary">
              <button type="button" onClick={this.showModal}>
                <p>Let&#39;s do it!</p>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  plans: state.plans.all,
});

export default withRouter(connect(mapStateToProps, { fetchPlans, createPlan, deletePlan })(Dashboard));
