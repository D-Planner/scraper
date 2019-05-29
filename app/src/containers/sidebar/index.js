import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SearchPane from './searchPane';
import RequirementsPane from './requirementsPane';
import BookmarksPane from './bookmarksPane';
import './sidebar.scss';
import {
  addCourseToFavorites, courseSearch, fetchBookmarks, fetchUser,
} from '../../actions';

const paneTypes = {
  SEARCH: 'SEARCH',
  REQUIREMENTS: 'REQUIREMENTS',
  BOOKMARKS: 'BOOKMARKS',
};

const Sidebar = (props) => {
  const [activePane, setActivePane] = useState(paneTypes.REQUIREMENTS);

  useEffect(() => {
    props.fetchBookmarks();
    props.fetchUser();
  }, []);

  const addToBookmarks = (courseId) => {
    props.addCourseToFavorites(courseId);
    props.fetchBookmarks();
  };

  return (
    <div className="sidebar">
      <SearchPane
        active={activePane === paneTypes.SEARCH}
        activate={() => setActivePane(paneTypes.SEARCH)}
        search={props.courseSearch}
        results={props.searchResults}
      />
      <RequirementsPane
        active={activePane === paneTypes.REQUIREMENTS}
        activate={() => setActivePane(paneTypes.REQUIREMENTS)}
        majors={props.user.majors}
      />
      <BookmarksPane
        active={activePane === paneTypes.BOOKMARKS}
        activate={() => setActivePane(paneTypes.BOOKMARKS)}
        bookmarks={props.bookmarks}
        addToBookmarks={addToBookmarks}
      />
    </div>
  );
};


const mapStateToProps = state => ({
  bookmarks: state.courses.bookmarks,
  searchResults: state.courses.results,
  user: state.user.current,
});

export default connect(mapStateToProps, {
  addCourseToFavorites, courseSearch, fetchBookmarks, fetchUser,
})(Sidebar);
