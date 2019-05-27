import React from 'react';
import classNames from 'classnames';
import { DropTarget as BookmarksPane } from 'react-dnd';
import { ItemTypes } from '../../../constants';
import DraggableCourse from '../../../components/draggableCourse';

import './bookmarksPane.scss';

const target = {
  drop: (props, monitor) => {
    const item = monitor.getItem();

    props.addToBookmarks(item.course.id);
  },
};

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
  };
};

const component = (props) => {
  const paneClass = classNames({
    bookmarks: true,
    pane: true,
    active: props.active,
  });

  return props.connectDropTarget(
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
                  removeCourseFromTerm={() => {}}
                />
              );
            })}
          </div>
        ) : null
          }
    </div>,
  );
};

// eslint-disable-next-line new-cap
export default BookmarksPane(ItemTypes.COURSE, target, collect)(component);