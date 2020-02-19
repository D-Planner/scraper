/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../draggableCourse/draggableCourse.scss';
import './staticCourseElement.scss';
import LikelyTerms from '../likelyTerms';
import { GenEdsForDisplay as GenEds, consoleLogging } from '../../constants';
import closeIcon from '../../style/close.svg';
import bookmarkEmpty from '../../style/bookmark.svg';
import bookmarkFilled from '../../style/bookmarkFilled.svg';
import check from '../../style/check.svg';

class CourseElement extends Component {
  constructor(props) {
    super(props);

    if (this.props.custom) {
      this.state = {
        isEditing: false,
        name: props.custom.name,
      };
    }
  }

  renderCourseSupplementaryInfo = () => {
    if (this.props.custom) {
      return (
        <div className="supplementary-course">
          <div className="likely-terms">You made this!</div>
          {this.props.showIcon ? (
            <div className="icon-container" role="button" onClick={this.props.onIconClick ? (e) => { e.stopPropagation(); this.props.onIconClick(); } : null}>
              {this.renderIcon(this.props.icon)}
            </div>
          ) : null}
        </div>
      );
    } else if (this.props.active) {
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
    } else {
      return (
        <div className="course-left">Already in your plan</div>
      );
    }
  }

  // Takes a string and decides which icon to use
  renderIcon = (name) => {
    switch (name) {
      case 'close':
        return <img className="course-action-icon" src={closeIcon} alt="icon" />;
      case 'bookmarkEmpty':
        return <img className="course-action-icon" src={bookmarkEmpty} alt="icon" />;
      case 'bookmarkFilled':
        return <img className="course-action-icon" src={bookmarkFilled} alt="icon" />;
      default:
        return null;
    }
  }

  renderCourseIdentifyingInfo = () => {
    if (this.props.custom) {
      return (
        <div className="hold-left">
          <div className="course-left">
            {`${this.props.custom.department}`}
          </div>
          <div className="spacer" />
          <div className="course-right">
            <div className="name">
              {this.state.isEditing
                ? (
                  <>
                    <input
                      className="custom-course-name custom-course-name-editing"
                      placeholder={this.state.name}
                      value={this.state.name}
                      onChange={e => this.setState({ name: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          this.setState({ isEditing: false });
                          this.props.updateCustomCourse(null, e.target.value);
                        }
                      }}
                    />
                    <img className="custom-course-name-check" src={check} alt="check" onClick={() => this.setState({ isEditing: false })} />
                  </>
                )
                : <div className="custom-course-name" role="button" tabIndex={-1} onClick={() => this.setState({ isEditing: true })}>{this.props.custom.name}</div>}
            </div>
            {/* {this.props.showIcon && this.props.custom ? (
              <div className="icon-container" role="button" onClick={this.props.onIconClick ? (e) => { e.stopPropagation(); this.props.onIconClick(); } : null}>
                {this.renderIcon(this.props.icon)}
              </div>
            ) : null} */}
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
