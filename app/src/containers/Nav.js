import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { signoutUser, fetchCourses } from '../actions/index';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <nav>
        <ul>
          { localStorage.getItem('token') !== null
            && (
            <div>
              <li><NavLink to="/" exact>Home</NavLink></li>
              <li onClick={() => this.props.signoutUser(this.props.history)}><NavLink to="/" exact>Sign out</NavLink></li>
              <li><NavLink to="/courses" exact>Courses</NavLink></li>
              <li><NavLink to="/plans" exact>Plans</NavLink></li>
            </div>
            )
          }
          { localStorage.getItem('token') === null
          && (
          <div>
            <li><NavLink to="/signin" exact>signin</NavLink></li>
            <li><NavLink to="/signup" exact>signup</NavLink></li>
          </div>
          )
         }
        </ul>
      </nav>
    );
  }
}

export default withRouter(connect(null, { signoutUser, fetchCourses })(Nav));
