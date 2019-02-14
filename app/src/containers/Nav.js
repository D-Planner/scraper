import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import {
  Icon,
} from 'evergreen-ui';
import { withRouter } from 'react-router-dom';
import { signoutUser, fetchCourses } from '../actions/index';

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
            <NavLink href="/courses" exact>Courses</NavLink>
          </DropdownItem>
          <DropdownItem>
            <NavLink href="/plans" exact>Plans</NavLink>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>
            <NavLink href="/"
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
            <NavLink href="/signin" exact>signin</NavLink>
          </DropdownItem>
          <DropdownItem>
            <NavLink href="/signup" exact>signup</NavLink>
          </DropdownItem>
        </div>
      );
    }

    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarToggler />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/dash/"
                  active={this.props.location.pathname.includes('dash')}
                >
Plan
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/discover/"
                  active={this.props.location.pathname.includes('discover')}
                >
Discover
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
