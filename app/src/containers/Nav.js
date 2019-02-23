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
import discDisb from '../style/discover_disb.png';
import disc from '../style/discover.png';
import planDisb from '../style/plan_disb.png';
import plan from '../style/plan.png';
import '../style/nav.css';

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
                <NavLink href="/dash/">
                  <img id={this.props.location.pathname.includes('dash')
                    ? '' : 'navItem'}
                    src={this.props.location.pathname.includes('dash')
                      ? plan : planDisb}
                    alt=""
                    onClick={() => {
                    //  search
                    }}
                    style={{
                      width: '61px',
                      height: '17px',
                      marginLeft: '5px',
                      marginRight: '5px',
                    }}
                  />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/discover/">
                  <img id={this.props.location.pathname.includes('discover')
                    ? '' : 'navItem'}
                    src={this.props.location.pathname.includes('discover')
                      ? disc : discDisb}
                    alt=""
                    onClick={() => {
                      //  search
                    }}
                    style={{
                      width: '121px',
                      height: '19px',
                      marginLeft: '5px',
                      marginRight: '5px',
                    }}
                  />
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
