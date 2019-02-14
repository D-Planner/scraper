import React from 'react';
import {
  Pane, Button,
} from 'evergreen-ui';
import '../dash.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signoutUser, fetchCourses } from '../actions/index';

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
      plans: test,
    };
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

  render() {
    let content = [];
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

    return (
      <div>
        {content}
      </div>
    );
  }
}

export default withRouter(connect(null, { signoutUser, fetchCourses })(Dashboard));
