import React, { Component } from 'react';

import '../draggableCourse/draggableCourse.scss';
import './staticCourseElement.scss';

// Props:
// course (Shortened Course Data)
// action {
//   type
//   svg
//   method
// }
//
//
class CourseElement extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className={`course ${this.props.size}`}>
        <div className="title-box">
          <div className="course-left">
            {`${this.props.course.department} ${this.props.course.number}`}
          </div>
          <div className="spacer" />
          <div className="course-right">
            <div className="name">
              {this.props.course.name}
            </div>
            <div className="check-box">
              <img className={this.props.action.type}
                src={this.props.action.svg}
                alt={this.props.action.type}
                onClick={this.props.action.method}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CourseElement;
