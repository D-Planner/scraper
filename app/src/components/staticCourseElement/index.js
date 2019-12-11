/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../draggableCourse/draggableCourse.scss';
import './staticCourseElement.scss';
import LikelyTerms from '../likelyTerms';
import { GenEdsForDisplay as GenEds } from '../../constants';
import closeIcon from '../../style/close.svg';
import bookmarkEmpty from '../../style/bookmark.svg';
import bookmarkFilled from '../../style/bookmarkFilled.svg';

class CourseElement extends Component {
  renderCourseSupplementaryInfo = () => {
    if (this.props.placeholder) {
      return (
        <div className="supplementary-course">
          {this.renderCourseIdentifyingInfo()}
          {this.props.showIcon ? (
            <div className="icon-container" role="button" onClick={this.props.onIconClick ? (e) => { e.stopPropagation(); this.props.onIconClick(); } : null}>
              {this.renderIcon(this.props.icon)}
            </div>
          ) : null}
        </div>
      );
    }
    return (
      <div className="supplementary-course">
        {
          !this.props.showIcon ? (
            <div className="likely-terms">
              <LikelyTerms terms={this.props.course.likely_terms} />
            </div>
          ) : null
        }
        <div className="genEds">
          <div className="distribs">
            {this.props.course.distribs ? this.props.course.distribs.map((distrib) => {
              return (
                <img key={distrib} className="icon" src={GenEds[distrib].icon} alt={`${GenEds[distrib].name} icon`} />
              );
            }) : null}
          </div>
          <div className="wcs">
            {this.props.course.wcs ? this.props.course.wcs.map((wc) => {
              return (
                <img key={wc} className="icon" src={GenEds[wc].icon} alt={`${GenEds[wc].name} icon`} />
              );
            }) : null}
          </div>
        </div>
        {this.props.showIcon ? (
          <div className="icon-container" role="button" onClick={this.props.onIconClick ? (e) => { e.stopPropagation(); this.props.onIconClick(); } : null}>
            {this.renderIcon(this.props.icon)}
          </div>
        ) : null}
      </div>
    );
  }

  // Takes a string and decides which icon to use
  renderIcon = (name) => {
    switch (name) {
      case 'close':
        return <img className="icon" src={closeIcon} alt="icon" />;
      case 'bookmarkEmpty':
        return <img className="icon" src={bookmarkEmpty} alt="icon" />;
      case 'bookmarkFilled':
        return <img className="icon" src={bookmarkFilled} alt="icon" />;
      default:
        return null;
    }
  }

  renderCourseIdentifyingInfo = () => {
    if (this.props.placeholder) {
      return (
        <div className="hold-left">
          <div className="course-left">
            {`${this.props.department}`}
          </div>
          <div className="spacer" />
          <div className="course-right">
            <div className="name">
              Placeholder
            </div>
          </div>
        </div>
      );
    }
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

const mapStateToProps = state => ({
  user: state.user.current,
});

export default connect(mapStateToProps, {})(CourseElement);
