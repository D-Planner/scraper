import React from 'react';
import DraggableCourse from '../../src/components/draggableCourse';
import './bucket.scss';

const Bucket = ({ bucket }) => {
  return (
    <div className="bucket">
      <h1 className="bucket-name">Bookmarked Classes</h1>
      <div className="course-list">
        {bucket.map((course, index) => {
          return (
            <DraggableCourse
              key={course.crn}
              index={index}
              course={course}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Bucket;
