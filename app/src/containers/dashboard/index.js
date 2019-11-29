/* eslint-disable max-len */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  fetchPlans, createPlan, showDialog, signoutUser, fetchUser,
} from '../../actions';
import lightbulbIcon from '../../style/lightbulb.svg';
import creditsIcon from '../../style/heart.svg';
import feedbackIcon from '../../style/comment-alt-solid.svg';
import personIcon from '../../style/person.svg';
import { emptyPlan } from '../../services/empty_plan';
import Plans from '../../components/plans';
import { DialogTypes } from '../../constants';
import ErrorMessage from '../ErrorMessage';
import './dashboard.scss';

/** Homepage of the application once authenticated - displays plans */
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.showUserData = this.showUserData.bind(this);
    this.showProfileDialog = this.showProfileDialog.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.createNewPlan = this.createNewPlan.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.goToPlan = this.goToPlan.bind(this);

    this.logError = this.logError.bind(this);
    this.displayIfError = this.displayIfError.bind(this);
  }

  componentWillMount() {
    this.props.fetchPlans();
  }

  displayIfError = () => {
    if ((this.props.errorMessage !== null) && (this.props.errorMessage !== 'Unauthorized')) {
      return <ErrorMessage />;
    } else {
      return null;
    }
  }

  logError() {
    console.log('function call working?');
    console.log(this.props.errorMessage);
  }

  createNewPlan(name) {
    const terms = ['F', 'W', 'S', 'X'];
    this.props.fetchUser().then(() => { // grabs most recent user data first
      let currYear = this.props.user.graduationYear - 4;
      let currQuarter = -1;
      this.props.createPlan({
        terms: emptyPlan.terms.map((term) => {
          if (currQuarter === 3) currYear += 1;
          currQuarter = (currQuarter + 1) % 4;
          return { ...term, year: currYear, quarter: terms[currQuarter] };
        }),
        name,
      }, this.props.setCurrentPlan).then(() => {
        this.props.fetchPlans();
      });
    });
  }

  goToPlan(id) {
    this.props.setCurrentPlan(id);
  }

  showDialog() {
    const dialogOptions = {
      title: 'New plan',
      okText: 'Create',
      onOk: (name, gradYear) => {
        this.createNewPlan(name, gradYear);
      },
    };
    this.props.showDialog(DialogTypes.NEW_PLAN, dialogOptions);
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
          <div className="plans-container">
            <Plans plans={this.props.plans} currentPlan={this.props.currentPlan} active={this.state.active} goToPlan={this.goToPlan} showDialog={this.showDialog} />
          </div>
          <div className="nav-container">
            <div role="presentation"
              onClick={this.showUserData}
              className="option-button"
            >
              {this.state.active
                ? (
                  <>
                    <img className="search-icon" src={lightbulbIcon} alt="search" />
                    <div className="space" />
                    <p>Interest Profile</p>
                  </>
                )
                : <img className="search-icon" src={lightbulbIcon} alt="search" />
              }
            </div>
            <div role="presentation" onClick={() => window.open('https://forms.gle/u1AYzJsogsP2YPZG6')} className="option-button">
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
              onClick={() => {
                this.props.fetchUser().then((r) => {
                  this.showProfileDialog(this.props);
                }).catch((e) => {
                  console.log(e);
                });
              }}
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
});

export default withRouter(connect(mapStateToProps, {
  fetchPlans, createPlan, showDialog, signoutUser, fetchUser,
})(Dashboard));
