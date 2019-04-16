import React from 'react';
import DraggableCourse from '../draggableCourse';
import './bucket.scss';

const Bucket = ({ bucket }) => {
  return (
    <div className="bucket">
      <h1 className="bucket-name">Bucket</h1>
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
