import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import classNames from 'classnames';
import robot from '../../../assets/avatars/robot.svg';
import { signoutUser, fetchCourses } from '../../actions';
import './nav.scss';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const discoverActive = this.props.location.pathname.includes('discover');
    const planClass = classNames({ 'nav-tab': true, 'nav-tab-active': !discoverActive });
    const discoverClass = classNames({ 'nav-tab': true, 'nav-tab-active': discoverActive });
    return (
      <nav>
        {this.props.authenticated === true ? (
          <ul>
            <div className="list-container">
              <li>
                <NavLink className={planClass} to="/">Plan</NavLink>
              </li>
              <li>
                <NavLink className={discoverClass} to="/discover">Discover</NavLink>
              </li>
              <li className="avatar-container">
                <img className="avatar" src={robot} alt="avatar" />
              </li>
            </div>
          </ul>
        ) : (
          <ul>
            <div className="list-container">
              <li>
                <NavLink className="log-in" to="/signin">Log in</NavLink>
              </li>
              <div className="sign-up-container">
                <li>
                  <NavLink className="sign-up" to="/signup">Sign up</NavLink>
                </li>
              </div>
            </div>
          </ul>
        )}
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
});

export default withRouter(connect(mapStateToProps, { signoutUser, fetchCourses })(Nav));