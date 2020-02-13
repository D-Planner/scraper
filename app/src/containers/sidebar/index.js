import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import SearchPane from './searchPane';
import RequirementsPane from './requirementsPane';
import BookmarksPane from './bookmarksPane';
import './sidebar.scss';
import { DialogTypes, Departments, errorLogging } from '../../constants';
import {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor,
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
      wcs: '',
      distribs: '',
      offered: '',
      resultsLoading: false,
    };

    this.searchRef = React.createRef();
    this.search = debounce(this.search, 5000);
  }

  componentDidMount() {
    this.props.fetchUser();
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
        setTimeout(() => this.props.fetchUser(), 100);
      },
    };
    this.props.showDialog(DialogTypes.DECLARE_MAJOR, opts);
  }

  handlePaneSwitch = (type) => {
    if (type !== paneTypes.SEARCH) {
      this.setSearchQuery('');
      this.props.setOpenPane(type);
    } else {
      this.props.setOpenPane(type);
    }
  }

  setFilter = (wcs, distribs, offered) => {
    console.log({ wcs, distribs, offered });
    this.setState({ wcs, distribs, offered });
    const queryParsed = {
      title: this.state.searchQuery,
      department: matchDepartment(this.state.searchQuery.split(' ')[0].toUpperCase()),
      number: this.state.searchQuery.split(' ')[1],
      distribs,
      wcs,
      offered,
    };
    console.log(queryParsed);
    this.props.stampIncrement((this.props.resultStamp + 1));
    this.setState({ resultsLoading: true });
    this.props.courseSearch(queryParsed, this.props.resultStamp).then(() => {
      this.setState({ resultsLoading: false });
    }).catch((error) => {
      loggingErrorsInSearchPane(error);
    });
  }

  setSearchQuery = (query) => {
    this.setState({ searchQuery: query });
    const queryParsed = {
      title: query,
      department: matchDepartment(query.split(' ')[0].toUpperCase()),
      number: query.split(' ')[1],
      distribs: this.state.distribs,
      wcs: this.state.wcs,
      offered: this.state.offered,
    };
    this.search(queryParsed);
  }

  search = (queryParsed) => {
    console.log(queryParsed);
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
          setSearchQuery={this.setSearchQuery}
          searchQuery={this.state.searchQuery}
          search={this.props.search}
          results={this.props.searchResults}
          resultStamp={this.props.resultStamp}
          stampIncrement={this.props.stampIncrement}
          setDraggingFulfilledStatus={this.props.setDraggingFulfilledStatus}
          currTerm={this.props.currTerm}
          showDialog={this.props.showDialog}
          resultsLoading={this.state.resultsLoading}
          setFilter={this.setFilter}
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
  bookmarks: state.courses.bookmarks,
  searchResults: state.courses.results,
  resultStamp: state.courses.resultStamp,
  user: state.user.current,
  currTerm: state.time.currTerm,
});

export default connect(mapStateToProps, {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor,
})(Sidebar);
