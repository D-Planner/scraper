import React from 'react';
import '../dashboard/dashboard.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  courseSearch, addCourseToFavorites,
} from '../../actions/index';
import scrollButton from '../../style/scrollButton.svg';
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

    this.dptRef = React.createRef();

    this.onInputChange = this.onInputChange.bind(this);
    this.searchByName = this.searchByName.bind(this);
    this.addCourseToFavorites = this.addCourseToFavorites.bind(this);
    this.scrollToDepartments = this.scrollToDepartments.bind(this);
  }

  onInputChange(event) {
    this.setState({ query: event.target.value });
  }

  /**
   * Takes this.state.query and sends this into the dispath.
   * thoughts on stronger logic:
   * user may type "COSC 10" or "COSC10" or follow some other unconventional way
   * what about pure department searches? "COSC"
   * maybe just run both checks, and see which results make sense. if there are no results that come up from the normal search,
   * but a singular result comes up from the direct search, then use the direct search.
   * @param {*} event
   */
  searchByName(event) {
    if (/^[a-z]{4}( |)\d{1,3}$/i.test(this.state.query)) {
      const department = this.state.query.match(/^[a-z]{4}/i)[0];
      const number = this.state.query.match(/\d+/)[0];
      this.props.courseSearch(this.state.query, department, number);
      this.setState({ displayingResults: true });
    } else {
      this.props.courseSearch(this.state.query, 'hello', '123');
      this.setState({
        displayingResults: true,
      });
    }
  }

  addCourseToFavorites(courseID) {
    this.props.addCourseToFavorites(courseID);
  }

  scrollToDepartments() {
    console.log(this.dptRef);
    window.scrollTo({
      top: this.dptRef.current.offsetTop,
      left: 0,
      behavior: 'smooth',
    });
  }

  discoverButtons() {
    const directSearch = classNames({
      'search-tab-active': this.state.searchDirect,
      searchLink: true,
    });
    const advancedSearch = classNames({
      'search-tab-active': !this.state.searchDirect,
      searchLink: true,
    });
    return (
      <div className="search-types">
        <button
          className="search-type-button"
          type="button"
          onClick={() => this.setState({ searchDirect: true })}
        >
          <div className={directSearch}>
            Direct Search
          </div>
        </button>
        <button
          className="search-type-button"
          type="button"
          onClick={() => this.setState({ searchDirect: false })}
        >
          <div className={advancedSearch}>
            Advanced Search
          </div>
        </button>
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
          <div className="results-container">
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
          </div>
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
                <p className="scroll-prompt-text">Scroll to Browse Department</p>
                <img src={scrollButton}
                  alt=""
                  onClick={this.scrollToDepartments}
                  className="scroll-prompt-button"
                />
              </div>
              <div ref={this.dptRef} />
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
