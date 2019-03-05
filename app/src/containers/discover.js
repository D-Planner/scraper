import React from 'react';
import {
  Button, Text,
} from 'evergreen-ui';
import {
  Container, Row, Col,
} from 'reactstrap';
import '../style/dash.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';
import classNames from 'classnames';
import Departments from './Departments';
import { signoutUser, fetchCourses, courseSearch } from '../actions/index';
import scrollButton from '../style/scrollButton.png';
import searchIcon from '../style/search.svg';
import SearchResultRow from '../components/searchResultRow';

import '../style/discover.scss';

class Discover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      searchDirect: true,
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.searchByName = this.searchByName.bind(this);
  }

  onInputChange(event) {
    this.setState({ query: event.target.value });
  }

  searchByName(event) {
    this.props.courseSearch({ query: this.state.query });
  }

  discoverButtons() {
    const directSearch = classNames({
      active: this.state.searchDirect,
      searchLink: true,
    });
    const advancedSearch = classNames({
      active: !this.state.searchDirect,
      searchLink: true,
    });
    return (
      <div className="search-types">
        <Button
          className="search-type-button"
          appearance="minimal"
          intent="none"
          onClick={() => this.setState({ searchDirect: true })}
        >
          <div className={directSearch}>
            Direct Search
          </div>
        </Button>
        <Button
          className="search-type-button"
          appearance="minimal"
          intent="none"
          onClick={() => this.setState({ searchDirect: false })}
        >
          <div className={advancedSearch}>
            Advanced Search
          </div>
        </Button>
      </div>
    );
  }

  discover() {
    return (
      <div>
        {this.discoverButtons()}
        <div className="search-box-container">
          <input
            value={this.state.query}
            onChange={this.onInputChange}
            placeholder="Search courses..."
            className="search-input"
          />
          <img src={searchIcon}
            alt=""
            onClick={this.searchByName}
            className="search-icon"
          />
        </div>
        <div>
          {this.renderSearchResults()}
        </div>
      </div>
    );
  }

  renderSearchResults() {
    console.log(this.props.searchResults);
    return (
      <Container fluid className="results">
        <div className="headers-row">
          <Row>
            <Col xs="2">
              <div className="name">
              Name
              </div>
            </Col>
            <Col xs="6">
              <div className="description">
              Description
              </div>
            </Col>
            <Col xs="1">
              <div className="period centered">
              Period
              </div>
            </Col>
            <Col xs="1">
              <div className="median centered">
              Median
              </div>
            </Col>
            <Col xs="2">
              <div className="distribs centered">
              Distributives
              </div>
            </Col>
          </Row>
        </div>
        {this.props.searchResults.map((course) => {
          return (
            <SearchResultRow course={course} key={course.id} />
          );
        })}
      </Container>
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

const mapStateToProps = state => (
  { searchResults: state.courses.results }
);

export default withRouter(connect(mapStateToProps, { signoutUser, fetchCourses, courseSearch })(Discover));
