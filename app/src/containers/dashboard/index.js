/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import ReactGA from 'react-ga';
import {
  fetchPlans, createPlan, showDialog, signoutUser,
} from '../../actions';
// import searchIcon from '../../style/searchSimple.svg';
import tutorialIcon from '../../style/tutorial.svg';
import creditsIcon from '../../style/heart.svg';
import feedbackIcon from '../../style/comment-alt-solid.svg';
import personIcon from '../../style/person.svg';
import Plans from '../../components/plans';
import { DialogTypes, BUG_REPORT_URL } from '../../constants';
import ErrorMessage from '../errorMessage';

import './dashboard.scss';

/** Homepage of the application once authenticated - displays plans */
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      loadingPlans: true,
    };
    this.showUserData = this.showUserData.bind(this);
    this.showProfileDialog = this.showProfileDialog.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.createNewPlan = this.createNewPlan.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.goToPlan = this.goToPlan.bind(this);

    this.displayIfError = this.displayIfError.bind(this);
  }

  componentWillMount() {
    this.props.fetchPlans().then(() => {
      this.setState({ loadingPlans: false });
    });
  }

  displayIfError = () => {
    if ((this.props.errorMessage !== null) && (this.props.errorMessage !== 'Unauthorized')) {
      return <ErrorMessage />;
    } else {
      return null;
    }
  }

  createNewPlan(name) {
    this.props.createPlan({
      name,
    }, this.props.setCurrentPlan).then(() => {
      this.props.fetchPlans();
    });
  }

  goToPlan(id) {
    this.props.setCurrentPlan(id);
    ReactGA.event({
      category: 'Plan',
      action: 'Open',
      value: id,
    });
  }

  handleMouseEnter() {
    this.setState({
      active: true,
    });
  }

  handleMouseLeave() {
    this.setState({
      active: false,
    });
  }

  showProfileDialog(props) {
    const dialogOptions = {
      title: `Hello${props.user.firstName ? `, ${props.user.firstName}!` : '!'}`,
      size: 'lg',
      okText: 'Sign out',
      onOk: () => {
        this.props.signoutUser(this.props.history);
      },
    };
    this.props.showDialog(DialogTypes.PROFILE, dialogOptions);
  }

  showUserData(props) {
    const dialogOptions = {
      title: 'Your Interests',
      size: 'lg',
      okText: 'Done',
    };
    this.props.showDialog(DialogTypes.INTEREST_PROFILE, dialogOptions);
  }

  render() {
    return (
      <div className="dashboard-container">
        <div className={classNames({
          menu: true,
          active: this.state.active,
        })}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          {/* ={this.state.loading} */}
          <div className="plans-container">
            <Plans loading={this.state.loadingPlans} plans={this.props.plans} currentPlan={this.props.currentPlan} active={this.state.active} goToPlan={this.goToPlan} showDialog={this.props.showNewPlanDialog} />
          </div>
          <div className="nav-container">
            <div role="presentation" onClick={() => window.open(BUG_REPORT_URL)} className="option-button">
              {this.state.active
                ? (
                  <>
                    <img className="search-icon" src={feedbackIcon} alt="search" />
                    <div className="space" />
                    <p>Feedback</p>
                  </>
                )
                : <img className="search-icon" src={feedbackIcon} alt="search" />
            }
            </div>
            <div role="presentation" onClick={() => this.props.history.push('/credits')} className="option-button">
              {this.state.active
                ? (
                  <>
                    <img className="search-icon" src={creditsIcon} alt="search" />
                    <div className="space" />
                    <p>Credits</p>
                  </>
                )
                : <img className="search-icon" src={creditsIcon} alt="search" />
            }
            </div>
            <div role="presentation"
              className="option-button"
              onClick={() => { this.showProfileDialog(this.props); }}
            >
              {this.state.active
                ? (
                  <>
                    <img className="search-icon" src={personIcon} alt="search" />
                    <div className="space" />
                    <p>Your Profile</p>
                  </>
                )
                : <img className="search-icon" src={personIcon} alt="search" />
            }
            </div>
          </div>
        </div>
        <div id="error-container">
          {this.displayIfError()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.current,
  plans: state.plans.all,
  currentPlan: state.plans.current,
  errorMessage: state.plans.errorMessage,
  authenticated: state.authenticated,
});

export default withRouter(connect(mapStateToProps, {
  fetchPlans, createPlan, showDialog, signoutUser,
})(Dashboard));
