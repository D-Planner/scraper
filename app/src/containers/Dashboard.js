import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Button,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Icon, Pane, SearchInput } from 'evergreen-ui';
import '../dash.css';
import { withRouter } from 'react-router-dom';
import Department from './Department';

const test = [{
  title: 'ENGS mod SART draft',
}, {
  title: 'ENGS mod ECON?',
}, {
  title: 'ECON with GOV minor',
}];

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
      plans: test,
      discover: '',
    };
  }

  navbar() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarToggler />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/dash/plan/"
                  active={this.props.location.pathname.includes('plan')}
                >
Plan
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/dash/discover/"
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
                  <DropdownItem>
                    Option 1
                  </DropdownItem>
                  <DropdownItem>
                    Option 2
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    Reset
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

  discoverNav() {
    return (
      <div>
        <Navbar color="faded" light expand="md">
          <NavbarToggler />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav style={{
              margin: 'auto',
            }}
              navbar
            >
              <NavItem>
                <NavLink href="/dash/discover/direct"
                  active={this.props.location.pathname.includes('direct')}
                >
Direct Search
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/dash/discover/advanced"
                  active={this.props.location.pathname.includes('advanced')}
                >
Advanced Search
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

  plans() {
    return (
      <Pane className="planPane">
        {this.state.plans.map((plan) => {
          return (
            <Pane className="plan"
              display="flex"
              padding={20}
              width={1200}
              background="tint2"
              borderRadius={3}
            >
              {plan.title}
            </Pane>
          );
        })}
      </Pane>
    );
  }

  discover() {
    return (
      <div>
        {this.discoverNav()}
        {this.state.discover}
        <div className="box">
          <SearchInput placeholder="Filter traits..."
            height={40}
            width={600}
          />
        </div>
      </div>
    );
  }

  render() {
    let content;
    if (this.props.location.pathname.includes('plan')) {
      content = (
        <div>
          <h4 style={{ float: 'left', margin: '30px' }}>MY PLANS</h4>
          <Button
            height={32}
            style={{
              float: 'right',
              margin: '30px',
            }}
          >
        New Plan
          </Button>
          {this.plans()}
        </div>
      );
    } else if (this.props.location.pathname.includes('discover')) {
      content = (
        <div>
          {this.discover()}
          <Department />
        </div>
      );
    }

    return (
      <div>
        {this.navbar()}
        {content}
      </div>
    );
  }
}

export default withRouter(Dashboard);
