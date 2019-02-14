import React from 'react';
import {
  SearchInput, Heading, Button,
} from 'evergreen-ui';
import '../dash.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Departments from './Departments';
import { signoutUser, fetchCourses } from '../actions/index';


class Discover extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      discover: '',
      searchDirect: true,
    };
  }


  discoverButtons() {
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
    let content = [];
    content = (
      <div>
        {this.discover()}
        <Departments />
      </div>
    );

    return (
      <div>
        {content}
      </div>
    );
  }
}

export default withRouter(connect(null, { signoutUser, fetchCourses })(Discover));
