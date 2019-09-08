import React, { Component } from 'react';

import '../draggableCourse/draggableCourse.scss';
import './staticCourseElement.scss';
import LikelyTerms from '../likelyTerms';

import { GenEds } from '../../constants';

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

  renderCourseSupplementaryInfo = () => {
    return (
      <>
        <div className="likely-terms">
          <LikelyTerms terms={this.props.course.likely_terms} />
        </div>
        <div className="genEds">
          <div className="distribs">
            {this.props.course.distribs.map((distrib) => {
              return (
                <img className="icon" src={GenEds[distrib].icon} alt={`${GenEds[distrib].name} icon`} />
              );
            })}
          </div>
          <div className="wcs">
            {this.props.course.wcs.map((wc) => {
              return (
                <img className="icon" src={GenEds[wc].icon} alt={`${GenEds[wc].name} icon`} />
              );
            })}
          </div>
        </div>
      </>
    );
  }

  renderCourseIdentifyingInfo = () => {
    return (
      <>
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
                  onClick={() => this.props.action.method(this.props.course.id)}
                />
              </div>
            )
            : <div />
        }
        </div>
      </>
    );
  }

  render() {
    return (
      <div className={`course ${this.props.size} ${this.props.error}`}>
        <div className="title-box">
          {this.props.beingHovered ? this.renderCourseSupplementaryInfo() : this.renderCourseIdentifyingInfo()}
        </div>
      </div>
    );
  }
}

export default CourseElement;
