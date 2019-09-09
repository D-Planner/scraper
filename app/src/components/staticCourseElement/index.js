import React, { Component } from 'react';
import classNames from 'classnames';

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
    console.log(this.props);
  }

  render() {
    return (
      <div className={classNames({
        course: true,
        [this.props.size]: true,
        [this.props.error]: true,
        [this.props.error]: true,
      })}
      >
        <div className="title-box">
          <div className="course-left">
            {`${this.props.course.department} ${this.props.course.number}`}
          </div>
          <div className="spacer" />
          <div className="course-right">
            <div className="name">
              {this.props.course.name}
            </div>
            {(this.props.action)
              ? (
                <div className="check-box">
                  <img className={this.props.action.type}
                    src={this.props.action.svg}
                    alt={this.props.action.type}
                    onClick={() => this.props.action.method(this.props.course.id)} // need to add the .then() here, or in the actions
                  />
                </div>
              )
              : <div />
            }

          </div>
        </div>
      </div>
    );
  }
}

export default CourseElement;
