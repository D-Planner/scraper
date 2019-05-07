import React from 'react';
import classNames from 'classnames';
import DraggableCourse from '../../draggableCourse';

import './bookmarksPane.scss';

const BookmarksPane = (props) => {
  const paneClass = classNames({
    bookmarks: true,
    pane: true,
    active: props.active,
  });

  return (
    <div className={paneClass} onClick={props.activate} role="presentation">
      <h1 className="pane-header">Bookmarked Classes</h1>
      {props.active
        ? (
          <div className="bookmarked-courses-list">
            {props.bookmarks.map((course, index) => {
              return (
                <DraggableCourse
                  key={course.crn}
                  index={index}
                  course={course}
                />
              );
            })}
          </div>
        ) : null
          }
    </div>
  );
};

export default BookmarksPane;
