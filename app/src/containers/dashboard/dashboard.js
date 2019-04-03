import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchPlans, createPlan } from '../../actions/index';
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

  render() {
    return (
      <div>
        {this.props.plans.length > 0 ? this.props.plans.map((plan) => {
          return (
            <div>
              <Modal show={this.state.show} handleClose={this.handleSubmit} text="Create">
                <p>Name your new plan</p>
                <input type="text" onChange={this.onInputChange} />
              </Modal>
              <button type="button" onClick={this.showModal}>
                <p>New Plan</p>
              </button>
              <Link to={`/plan/${plan.id}`} key={plan.id}>
                <div>{plan.name}</div>
              </Link>
            </div>
          );
        }) : (
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
            <div className="button-container">
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

export default withRouter(connect(mapStateToProps, { fetchPlans, createPlan })(Dashboard));
