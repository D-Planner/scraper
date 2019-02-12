import React from 'react';
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
  Icon, Pane, SearchInput, Heading, Button,
} from 'evergreen-ui';
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
      searchDirect: true,
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

  discoverButtons() {
    // let buttons;
    // if (this.state.searchDirect) {
    //   buttons = (
    //     <div>
    //       <Button marginRight={16}
    //         appearance="minimal"
    //         intent="none"
    //         height={40}
    //         isActive="true"
    //       >
    //         <Strong>
    //               Direct Search
    //         </Strong>
    //       </Button>
    //       <Button marginRight={16}
    //         appearance="minimal"
    //         intent="none"
    //         height={40}
    //         isActive="false"
    //       >
    //         <p>Advanced Search</p>
    //       </Button>
    //     </div>
    //   );
    // } else {
    //   buttons = (
    //     <div>
    //       <Button
    //         color="secondary"
    //         height={32}
    //       >
    //         <p>
    //               Direct Search
    //         </p>
    //       </Button>
    //       <Button color="secondary"
    //         outline
    //         height={32}
    //       >
    //         <Strong>Advanced Search</Strong>
    //       </Button>
    //     </div>
    //   );
    // }
    return (
      <div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: '20px',
        }}
        >
          <Button marginRight={16}
            appearance="minimal"
            intent="none"
            height={48}
            onClick={() => this.setState({ searchDirect: true })}
          >
            <Heading size={500}
              style={this.state.searchDirect ? {
                textDecoration: 'underline',
                fontWeight: 'bold',
              } : {}}
            >
              {this.state.searchDirect}
                  Direct Search
            </Heading>
          </Button>
          <Button marginRight={16}
            appearance="minimal"
            intent="none"
            height={48}
            onClick={() => this.setState({ searchDirect: false })}
          >
            <Heading size={500}
              style={!this.state.searchDirect ? {
                textDecoration: 'underline',
                fontWeight: 'bold',
              } : {}}
            >
            Advanced Search
            </Heading>
          </Button>
        </div>
      </div>
    );
  }

  plans() {
    return (
      <Pane className="planPane"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
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
      </Pane>
    );
  }

  discover() {
    return (
      <div>
        {this.discoverButtons()}
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
          <Pane style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          >
            <h4 style={{ margin: '30px' }}>MY PLANS</h4>
            <Button
              height={32}
              style={{
                margin: '30px',
              }}
            >
        New Plan
            </Button>
          </Pane>
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
