/* eslint-disable max-len */
import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  fetchPlans, createPlan, showDialog, signoutUser, fetchUser,
} from '../../actions';
import { emptyPlan } from '../../services/empty_plan';
import Plans from '../../components/plans';
import { DialogTypes } from '../../constants';
import ErrorMessage from '../ErrorMessage';
import robot from '../../../assets/avatars/robot.svg';


import './dashboard.scss';

/** Homepage of the application once authenticated - displays plans */
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
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

  createNewPlan(name, gradYear) {
    const terms = ['F', 'W', 'S', 'X'];
    let currYear = gradYear - 4;
    let currQuarter = -1;
    this.props.createPlan({
      terms: emptyPlan.terms.map((term) => {
        if (currQuarter === 3) currYear += 1;
        currQuarter = (currQuarter + 1) % 4;
        return { ...term, year: currYear, quarter: terms[currQuarter] };
      }),
      name,
    }, this.props.setCurrentPlan);
  }

  goToPlan(id) {
    this.props.setCurrentPlan(id);
    // this.props.history.push(`/plan/${id}`);
  }

  showDialog() {
    const dialogOptions = {
      title: 'Name your plan',
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
      size: 'lg',
      showOk: false,
    };
    this.props.showDialog(DialogTypes.PROFILE, dialogOptions);
  }

  render() {
    return (
      <div className={classNames({
        menu: true,
        active: this.state.active,
      })}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className="plans-container">
          <Plans plans={this.props.plans} active={this.state.active} goToPlan={this.goToPlan} showDialog={this.showDialog} />
        </div>
        <div className="list-container">
          <NavLink to="/discover">Discover</NavLink>
          <NavLink to="/" onClick={() => this.props.signoutUser(this.props.history)}>Sign out</NavLink>
          <div className="avatar-container">
            <img className="avatar"
              src={robot}
              width="40px"
              alt="avatar"
              onClick={() => {
                this.props.fetchUser().then((r) => {
                  this.showProfileDialog(this.props);
                }).catch((e) => {
                  console.log(e);
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  plans: state.plans.all,
  errorMessage: state.plans.errorMessage,
});

export default withRouter(connect(mapStateToProps, {
  fetchPlans, createPlan, showDialog, signoutUser, fetchUser,
})(Dashboard));
