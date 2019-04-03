import React from 'react';
import {
  Button, Text,
} from 'evergreen-ui';
import {
  Container,
} from 'reactstrap';
import '../dashboard/dashboard.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import $ from 'jquery';
import classNames from 'classnames';
import Departments from '../departments/departments';
import {
  courseSearch, addCourseToFavorites,
} from '../../actions/index';
import scrollButton from '../../style/scrollButton.png';
import searchIcon from '../../style/search.svg';
import SearchResultRow from '../../components/searchResultRow';

import './discover.scss';

class Discover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      searchDirect: true,
      displayingResults: false,
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.searchByName = this.searchByName.bind(this);
    this.addCourseToFavorites = this.addCourseToFavorites.bind(this);
  }

  onInputChange(event) {
    this.setState({ query: event.target.value });
  }

  searchByName(event) {
    this.props.courseSearch({ query: this.state.query });
    this.setState({
      displayingResults: true,
    });
  }

  addCourseToFavorites(courseID) {
    this.props.addCourseToFavorites(courseID);
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
        {this.state.searchDirect
          ? this.renderSearchResults()
          : (
            <div className="results-with-filters">
              {this.renderSearchResults()}
              {this.renderFilters()}
            </div>
          )
        }
      </div>
    );
  }

  renderSearchResults() {
    if (this.state.displayingResults && this.props.searchResults.length) {
      return (
        <div className="results">
          <Container fluid className="results-container">
            <div className="headers-row">
              <div className="name headers-col">
                  Name
              </div>
              <div className="description headers-col">
                  Description
              </div>
              <div className="period headers-col centered">
                  Period
              </div>
              <div className="median headers-col centered">
                  Median
              </div>
              <div className="distribs headers-col centered">
                  Distributives
              </div>
            </div>
            <div className="results-display-container">
              {this.props.searchResults.map((course) => {
                return (
                  <SearchResultRow course={course} key={course.id} id={course.id} addCourseToFavorites={this.addCourseToFavorites} />
                );
              })}
            </div>
          </Container>
        </div>
      );
    } else if (this.state.displayingResults) {
      return <div className="no-results">No results :(</div>;
    } else {
      return <div />;
    }
  }

  renderFilters() {
    console.log(this.state);
    return (
      <div className="filters">
        <p className="filters-header">Filters</p>
        <p>To be implemented later...</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.discover()}
        {this.state.displayingResults
          ? <div /> // don't show the scroll arrow if displaying results
          : (
            <div>
              <div className="scroll-prompt-container">
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
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => (
  { searchResults: state.courses.results }
);

export default withRouter(connect(mapStateToProps, {
  courseSearch, addCourseToFavorites,
})(Discover));
