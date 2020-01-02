import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchPane from './searchPane';
import RequirementsPane from './requirementsPane';
import BookmarksPane from './bookmarksPane';
import './sidebar.scss';
import { DialogTypes } from '../../constants';
import {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor,
} from '../../actions';

export const paneTypes = {
  SEARCH: 'SEARCH',
  REQUIREMENTS: 'REQUIREMENTS',
  BOOKMARKS: 'BOOKMARKS',
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
    };

    this.searchRef = React.createRef();
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

  setSearchQuery = (quiery) => {
    this.setState({ searchQuery: quiery });
  }

  render() {
    return (
      <div className="sidebar">
        <SearchPane
          active={this.props.openPane === paneTypes.SEARCH}
          activate={() => { if (this.props.openPane !== paneTypes.SEARCH) this.handlePaneSwitch(paneTypes.SEARCH); }}
          setSearchQuery={this.setSearchQuery}
          searchQuery={this.state.searchQuery}
          search={this.props.courseSearch}
          results={this.props.searchResults}
          resultStamp={this.props.resultStamp}
          stampIncrement={this.props.stampIncrement}
          setDraggingFulfilledStatus={this.props.setDraggingFulfilledStatus}
          currTerm={this.props.currTerm}
          showDialog={this.props.showDialog}
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
