import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import robot from '../../../assets/avatars/robot.svg';
import { signoutUser, fetchCourses } from '../../actions/index';
import './nav.scss';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <nav>
        {this.props.authenticated === true ? (
          <ul>
            <div className="list-container">
              <li>
                <NavLink className="plan" to="/discover">Plan</NavLink>
              </li>
              <li>
                <NavLink className="discover" to="/discover">Discover</NavLink>
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
