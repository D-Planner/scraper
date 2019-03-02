import React from 'react';
import {
  SearchInput, Heading, Button, Text,
} from 'evergreen-ui';
import '../style/dash.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';
import Departments from './Departments';
import { signoutUser, fetchCourses } from '../actions/index';
import scrollButton from '../style/scrollButton.png';
import searchIcon from '../style/searchIcon.png';

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
          <img src={searchIcon}
            alt=""
            onClick={() => {
              //  search
            }}
            style={{
              width: '57px',
              height: '57px',
              marginLeft: '10px',
            }}
          />
        </div>
      </div>
    );
  }

  render() {
    let content = [];
    content = this.state.searchDirect ? (
      <div>
        {this.discover()}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '40vh',
        }}
        >
          <Text id="t1">
Scroll to Browse Department
          </Text>
          <img src={scrollButton}
            alt=""
            onClick={() => {
              $('html, body').animate({
                scrollTop: $('#dptRef').offset().top,
              }, 500);
            }}
            style={{
              width: '42px',
              height: '42px',
              marginTop: '10px',
            }}
          />
        </div>
        <div id="dptRef">
          <Departments id="DPT" />
        </div>
      </div>
    ) : (<div />);

    return (
      <div>
        {content}
      </div>
    );
  }
}

export default withRouter(connect(null, { signoutUser, fetchCourses })(Discover));
