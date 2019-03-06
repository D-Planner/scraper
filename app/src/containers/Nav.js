import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import {
  Icon,
} from 'evergreen-ui';
import { withRouter, NavLink } from 'react-router-dom';
import { signoutUser, fetchCourses } from '../actions/index';
import '../style/nav.scss';

class DNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
    };
  }

  navbar() {
    let dropdown;
    if (localStorage.getItem('token') !== null) {
      dropdown = (
        <div>
          <DropdownItem>
            <NavLink to="/courses" exact>Courses</NavLink>
          </DropdownItem>
          <DropdownItem>
            <NavLink to="/" exact>Plans</NavLink>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>
            <NavLink to="/"
              onClick={() => this.props.signoutUser(this.props.history)}
              exact
            >
Sign out
            </NavLink>
          </DropdownItem>
        </div>
      );
    } else {
      dropdown = (
        <div>
          <DropdownItem>
            <NavLink to="/signin" exact>signin</NavLink>
          </DropdownItem>
          <DropdownItem>
            <NavLink to="/signup" exact>signup</NavLink>
          </DropdownItem>
        </div>
      );
    }

    return (
      <div>
        <Navbar color="light" light expand="md" className="nav">
          <NavbarToggler />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink to="/" exact className="nav-link">
                  <p>HOME</p>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/discover" className="nav-link">
                  <p>DISCOVER</p>
                </NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  <Icon icon="user" size={30} />
                </DropdownToggle>
                <DropdownMenu right>
                  {dropdown}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.navbar()}
      </div>
    );
  }
}

export default withRouter(connect(null, { signoutUser, fetchCourses })(DNav));
