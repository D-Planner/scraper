import React, { useState } from 'react';
import SearchPane from './searchPane';
import RequirementsPane from './requirementsPane';
import BookmarksPane from './bookmarksPane';
import './sidebar.scss';

const paneTypes = {
  SEARCH: 'SEARCH',
  REQUIREMENTS: 'REQUIREMENTS',
  BOOKMARKS: 'BOOKMARKS',
};

const Sidebar = (props) => {
  const [activePane, setActivePane] = useState(paneTypes.REQUIREMENTS);

  return (
    <div className="sidebar">
      <SearchPane active={activePane === paneTypes.SEARCH} activate={() => setActivePane(paneTypes.SEARCH)} />
      <RequirementsPane active={activePane === paneTypes.REQUIREMENTS} activate={() => setActivePane(paneTypes.REQUIREMENTS)} />
      <BookmarksPane
        active={activePane === paneTypes.BOOKMARKS}
        activate={() => setActivePane(paneTypes.BOOKMARKS)}
        bookmarks={props.bookmarks}
      />
    </div>
  );
};

export default Sidebar;
