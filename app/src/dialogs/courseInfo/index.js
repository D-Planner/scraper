import React from 'react';
import DialogWrapper from '../dialogWrapper';

import './courseInfo.scss';

const CourseInfoDialog = (props) => {
  console.log(props);
  return (
    <DialogWrapper {...props}>
      <div className="new-plan-content">
        <div className="description">{courseInfo(props.data)}</div>
      </div>
    </DialogWrapper>
  );
};

const courseInfo = (course) => {
  return (
    <div>
      <div>{course.department}</div>
      <div>{course.description}</div>
      <div>
        Latest Term:
        {' '}
        {course.term}
      </div>
      <div>{course.distrib}</div>
      <div>
        Layup-list Score:
        {' '}
        {course.layuplist_score}
      </div>

    </div>
  );
};

export default CourseInfoDialog;
