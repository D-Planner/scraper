import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'debounce';
import SearchPane from './searchPane';
import RequirementsPane from './requirementsPane';
import BookmarksPane from './bookmarksPane';
import './sidebar.scss';
import { DialogTypes, Departments, errorLogging } from '../../constants';
import {
  addCourseToFavorites, courseSearch, stampIncrement, clearSearch, fetchBookmarks, showDialog, declareMajor, clearFilters,
} from '../../actions';

export const paneTypes = {
  SEARCH: 'SEARCH',
  REQUIREMENTS: 'REQUIREMENTS',
  BOOKMARKS: 'BOOKMARKS',
};

const loggingErrorsInSearchPane = (e) => {
  errorLogging('app/src/containers/sidebar/searchPane.js', e);
};

const matchDepartment = (department) => {
  return (Departments.includes(department)) ? department : null;
};

/**
 * @name Sidebar
 * @description displays important information in panes on the side of the dplan component
 */
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      resultsLoading: false,
    };

    this.searchRef = React.createRef();
    this.search = debounce(this.search, 1000);
  }

  addToBookmarks = (courseId) => {
    this.props.addCourseToFavorites(courseId);
  }

  showDeclareDialog = () => {
    const opts = {
      title: 'Declare New Major',
      okText: 'Enroll',
      onOk: (majorID) => {
        this.props.declareMajor(majorID);
      },
    };
    this.props.showDialog(DialogTypes.DECLARE_MAJOR, opts);
  }

  handlePaneSwitch = (type) => {
    if (type !== paneTypes.SEARCH) {
      this.setState({ searchQuery: '' });
      this.props.clearSearch();
      this.props.setOpenPane(type);
    } else {
      this.props.setOpenPane(type);
    }
  }

  useFilterToSearch = (wcs, distribs, offered) => {
    const queryParsed = {
      title: this.state.searchQuery,
      department: matchDepartment(this.state.searchQuery.split(' ')[0].toUpperCase()),
      number: this.state.searchQuery.split(' ')[1],
      distribs,
      wcs,
      offered,
    };
    if (this.state.searchQuery.length > 2) {
      this.props.stampIncrement((this.props.resultStamp + 1));
      this.setState({ resultsLoading: true });
      this.props.courseSearch(queryParsed, this.props.resultStamp).then(() => {
        this.setState({ resultsLoading: false });
      }).catch((error) => {
        loggingErrorsInSearchPane(error);
      });
    }
  }

  useQueryToSearch = (query) => {
    const wcs = this.props.filters.wcs.filter(e => e.checked).map(e => e.name);
    const distribs = this.props.filters.distribs.filter(e => e.checked).map(e => e.tag);
    const offered = this.props.filters.offered.filter(e => e.checked).map(e => e.term);
    this.setState({ searchQuery: query });
    const queryParsed = {
      title: query,
      department: matchDepartment(query.split(' ')[0].toUpperCase()),
      number: query.split(' ')[1],
      distribs,
      wcs,
      offered,
    };
    if (query.length > 2) {
      this.search(queryParsed);
    }
  }

  search = (queryParsed) => {
    this.props.stampIncrement((this.props.resultStamp + 1));
    this.setState({ resultsLoading: true });
    this.props.courseSearch(queryParsed, this.props.resultStamp).then(() => {
      this.setState({ resultsLoading: false });
    }).catch((error) => {
      loggingErrorsInSearchPane(error);
    });
  }

  render() {
    return (
      <div className="sidebar">
        <SearchPane
          active={this.props.openPane === paneTypes.SEARCH}
          activate={() => { if (this.props.openPane !== paneTypes.SEARCH) this.handlePaneSwitch(paneTypes.SEARCH); }}
          useQueryToSearch={this.useQueryToSearch}
          searchQuery={this.state.searchQuery}
          search={this.props.search}
          results={this.props.searchResults}
          resultStamp={this.props.resultStamp}
          stampIncrement={this.props.stampIncrement}
          setDraggingFulfilledStatus={this.props.setDraggingFulfilledStatus}
          currTerm={this.props.currTerm}
          showDialog={this.props.showDialog}
          resultsLoading={this.state.resultsLoading}
          useFilterToSearch={this.useFilterToSearch}
        />
        <RequirementsPane
          active={this.props.openPane === paneTypes.REQUIREMENTS}
          activate={() => this.handlePaneSwitch(paneTypes.REQUIREMENTS)}
          majors={this.props.user.majors}
          showDeclareDialog={this.showDeclareDialog}
          userCourses={this.props.planCourses}
        />
        <BookmarksPane
          active={this.props.openPane === paneTypes.BOOKMARKS}
          activate={() => this.handlePaneSwitch(paneTypes.BOOKMARKS)}
          bookmarks={this.props.user.favorite_courses}
          addToBookmarks={this.addToBookmarks}
          setDraggingFulfilledStatus={this.props.setDraggingFulfilledStatus}
          currTerm={this.props.currTerm}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  filters: state.filters,
  bookmarks: state.courses.bookmarks,
  searchResults: state.courses.results,
  resultStamp: state.courses.resultStamp,
  user: state.user.current,
  currTerm: state.time.currTerm,
});

export default connect(mapStateToProps, {
  addCourseToFavorites, courseSearch, stampIncrement, clearSearch, fetchBookmarks, showDialog, declareMajor, clearFilters,
})(Sidebar);
