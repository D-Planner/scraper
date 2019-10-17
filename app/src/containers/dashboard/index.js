/* eslint-disable max-len */
import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { HotKeys } from 'react-hotkeys';
import {
  fetchPlans, createPlan, showDialog, signoutUser, fetchUser,
} from '../../actions';
import searchIcon from '../../style/searchSimple.svg';
import feedbackIcon from '../../style/comment-alt-solid.svg';
import personIcon from '../../style/person.svg';
import { emptyPlan } from '../../services/empty_plan';
import Plans from '../../components/plans';
import { DialogTypes } from '../../constants';
import ErrorMessage from '../ErrorMessage';


import './dashboard.scss';

/** Homepage of the application once authenticated - displays plans */
class Dashboard extends React.Component {
  keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  // keyMap = {
  //   PLAN_ONE: 'Control+1',
  //   PLAN_TWO: 'Control+2',
  //   PLAN_THREE: 'Control+3',
  //   PLAN_FOUR: 'Control+4',
  //   PLAN_FIVE: 'Control+5',
  //   PLAN_SIX: 'Control+6',
  //   PLAN_SEVEN: 'Control+7',
  //   PLAN_EIGHT: 'Control+8',
  //   PLAN_NINE: 'Control+9',
  //   PLAN_TEN: 'Control+0',
  //   // OK: 'Enter',
  //   // CLOSE: 'Escape',
  //   SAVE: 'Control+s',
  //   OPEN_NEW_PLAN: 'Control+y',
  //   // OPEN_DELETE_PLAN: 'Control+d',
  //   // OPEN_SEARCH_PANE: 'Control+q',
  //   // OPEN_REQUIREMENTS_PANE: 'Control+r',
  //   // OPEN_BOOKMARKS_PANE: 'Control+b',
  // };

  // handlers = {
  //   PLAN_ONE: event => this.test(event),
  //   PLAN_TWO: event => this.test(event),
  //   PLAN_THREE: null,
  //   PLAN_FOUR: null,
  //   PLAN_FIVE: null,
  //   PLAN_SIX: null,
  //   PLAN_SEVEN: null,
  //   PLAN_EIGHT: null,
  //   PLAN_NINE: null,
  //   PLAN_TEN: null,
  //   // OK: this.test,
  //   // CLOSE: null,
  //   SAVE: event => this.test(event),
  //   OPEN_NEW_PLAN: event => this.test(event),
  //   // OPEN_DELETE_PLAN: null,
  //   // OPEN_SEARCH_PANE: event => console.log('search pane test'),
  //   // OPEN_REQUIREMENTS_PANE: null,
  //   // OPEN_BOOKMARKS_PANE: null,
  // };

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

  // test(event) {
  //   event.preventDefault();
  //   console.log('test function');
  //   this.props.goToPlan(this.props.plans[1].id);
  // }

  componentWillMount() {
    this.props.fetchPlans();
  }

  componentDidUpdate = () => {
    // if (this.props.pressedModifier === 'Control') {
    //   console.log('Pressed Control in Dashboard');
    //   for (let i = 0; i < this.props.plans.length; i += 1) {
    //     if (this.keys[i] === this.props.pressedKey) {
    //       if (this.props.plans[i].id !== (this.props.currentPlan ? this.props.currentPlan.id : 0)) {
    //         console.log(`Switching to plan ${this.props.plans[i].id}`);
    //         this.goToPlan(this.props.plans[i].id);
    //       }
    //     }
    //   }

    //   // console.log(this.props.plans[0]._id);
    //   switch (this.props.pressedKey) {
    //     case 'n':
    //       this.showDialog();
    //       break;
    //     default:
    //       break;
    //   }
    // }
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
    // this.props.history.push(`/plan/${id}`);
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
      title: `Hello, ${props.user.first_name}`,
      size: 'lg',
      okText: 'Sign out',
      onOk: () => {
        this.props.signoutUser(this.props.history);
      },
    };
    this.props.showDialog(DialogTypes.PROFILE, dialogOptions);
  }

  render() {
    return (
    // <Fragment>
      <HotKeys keyMap={this.keyMap} handlers={this.handlers} className="key-container">
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
              <div role="presentation" onClick={() => this.props.history.push('/discover')} className="option-button">
                {this.state.active
                  ? (
                    <>
                      <img className="search-icon" src={searchIcon} alt="search" />
                      <div className="space" />
                      <p>Discover</p>
                    </>
                  )
                  : <img className="search-icon" src={searchIcon} alt="search" />
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
              {/* <NavLink to="/" onClick={() => this.props.signoutUser(this.props.history)}>Sign out</NavLink> */}
            </div>
          </div>
          <div id="error-container">
            {this.displayIfError()}
          </div>
        </div>
      </HotKeys>
    // </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.current,
  plans: state.plans.all,
  currentPlan: state.plans.current,
  errorMessage: state.plans.errorMessage,
  pressedKey: state.keyEvent.pressedKey,
  pressedModifier: state.keyEvent.pressedModifier,
});

export default withRouter(connect(mapStateToProps, {
  fetchPlans, createPlan, showDialog, signoutUser, fetchUser,
})(Dashboard));
