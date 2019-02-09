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
import { Icon, Pane } from 'evergreen-ui';
import '../dash.css';

const test = [{
  title: 'ENGS mod SART draft',
}, {
  title: 'ENGS mod ECON?',
}, {
  title: 'ECON with GOV minor',
}];

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      active: 'plan',
      plans: test,
    };
  }

  toggle() {
    this.setState((prevState) => {
      return { isOpen: !prevState.isOpen };
    });
  }

  navbar() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/dash" active={this.state.active === 'plan'}>Plan</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/discover/" active={this.state.active === 'discover'}>Discover</NavLink>
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

  plans() {
    return (
      <div style={{
        marginTop: '100px',
      }}
      >
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
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.navbar()}
        <Pane>
          <h4 style={{ float: 'left', margin: '30px' }}>MY PLANS</h4>
          <Button margin-right={12}
            height={32}
            style={{
              float: 'right',
              margin: '30px',
            }}
          >
        New Plan
          </Button>
        </Pane>
        {this.plans()}
      </div>
    );
  }
}
