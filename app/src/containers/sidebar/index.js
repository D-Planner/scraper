import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SearchPane from './searchPane';
import RequirementsPane from './requirementsPane';
import BookmarksPane from './bookmarksPane';
import './sidebar.scss';
import { DialogTypes } from '../../constants';
import {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor,
} from '../../actions';

const paneTypes = {
  SEARCH: 'SEARCH',
  REQUIREMENTS: 'REQUIREMENTS',
  BOOKMARKS: 'BOOKMARKS',
};

/**
 * @name Sidebar
 * @description displays important information in panes on the side of the dplan component
 */
const Sidebar = (props) => {
  const [activePane, setActivePane] = useState(paneTypes.REQUIREMENTS);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    props.fetchUser();
  }, []);

  const addToBookmarks = (courseId) => {
    props.addCourseToFavorites(courseId);
  };

  const showDeclareDialog = () => {
    const opts = {
      title: 'Declare New Major',
      okText: 'Enroll',
      onOk: (majorID) => {
        props.declareMajor(majorID);
        setTimeout(() => props.fetchUser(), 100);
      },
    };
    props.showDialog(DialogTypes.DECLARE_MAJOR, opts);
  };

  const handlePaneSwitch = (type) => {
    if (type !== paneTypes.SEARCH) {
      setSearchQuery('');
      setActivePane(type);
    } else {
      setActivePane(type);
    }
  };

  return (
    <div className="sidebar">
      <SearchPane
        active={activePane === paneTypes.SEARCH}
        activate={() => handlePaneSwitch(paneTypes.SEARCH)}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        search={props.courseSearch}
        results={props.searchResults}
        resultStamp={props.resultStamp}
        stampIncrement={props.stampIncrement}
        setDraggingFulfilledStatus={props.setDraggingFulfilledStatus}
        currTerm={props.currTerm}
        showDialog={props.showDialog}
      />
      <RequirementsPane
        active={activePane === paneTypes.REQUIREMENTS}
        activate={() => handlePaneSwitch(paneTypes.REQUIREMENTS)}
        majors={props.user.majors}
        showDeclareDialog={showDeclareDialog}
        // distribs={props.planCourses.map(c => c.course.distrib)}
        // wcs={props.planCourses.map(c => c.course.wc)}
        userCourses={props.planCourses}
      />
      <BookmarksPane
        active={activePane === paneTypes.BOOKMARKS}
        activate={() => handlePaneSwitch(paneTypes.BOOKMARKS)}
        bookmarks={props.user.favorite_courses}
        addToBookmarks={addToBookmarks}
        currTerm={props.currTerm}
      />
    </div>
  );
};


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
