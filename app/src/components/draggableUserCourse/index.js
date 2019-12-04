import React, { Component } from 'react';
import axios from 'axios';
import '../draggableCourse/draggableCourse.scss';
import { DragSource as DraggableUserCourse } from 'react-dnd';
import { connect } from 'react-redux';
import { ItemTypes, DialogTypes, ROOT_URL } from '../../constants';
import { showDialog, setDraggingState } from '../../actions';
import CourseElement from '../staticCourseElement';

const source = {
  beginDrag(props) {
    props.setDraggingState(true, props.catalogCourse);
    props.setDraggingFulfilledStatus(props.catalogCourse.id);
    return {
      userCourse: props.course,
      catalogCourse: props.catalogCourse,
      sourceTerm: props.sourceTerm,
    };
  },
  endDrag(props, monitor) {
    props.setDraggingState(false, null);
    // if we did not detect a valid drop target, delete the course from the sourceTerm
    if (!monitor.didDrop()) {
      console.log(props.course);
      props.removeCourseFromTerm(props.course.id, props.sourceTerm).then(() => {
        console.log('removed');
      }).catch((e) => {
        console.log(e);
      });
    }
  },
};

const collect = (connectDrag, monitor) => {
  return {
    connectDragSource: connectDrag.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

const getTerm = (termID) => {
  return new Promise((resolve, reject) => {
    axios.get(`${ROOT_URL}/terms/${termID}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((response) => {
      resolve(response.data);
    })
      .catch((error) => {
        reject(error);
      });
  });
};

/** a drag-n-drop capable component containing information on a UserCourse object */
class UserCourse extends Component {
  constructor(props) {
    super(props);
    this.catalogCourse = props.catalogCourse;
    this.state = {
      beingHovered: false,
    };
  }

  /**
   * Sends off information for [dialogOrchestrator].
   * THIS FEATURE IS NOT COMPLETE, NEED TO BUILD SPECIAL RENDERING DEPENDING ON USER CHOICES OF [hour] AND [distribs].
   * @param {*} props
   */
  showCourseInfoDialog = () => {
    //console.log(this.props.previousCourses);
    const dialogOptions = {
      title: `${this.props.catalogCourse.department} ${this.props.catalogCourse.number}: ${this.props.catalogCourse.name}`,
      size: 'lg',
      data: this.props.catalogCourse,
      previousCourses: this.props.previousCourses,
      showOk: false,
    };

    // Fetches term and checks if course is likely to be offered then
    if (this.props.course.course.likely_terms) {
      getTerm(this.props.sourceTerm).then((term) => {
        if (this.props.course.course.offered === true && this.props.currentTerm.year + this.props.currentTerm.term === term.name) { // Offered and in current term
          dialogOptions.infoBarMessage = `Offered during ${term.name}`;
        } else if (this.props.course.course.offered === false && this.props.currentTerm.year + this.props.currentTerm.term === term.name) { // Not offered and in current term
          dialogOptions.infoBarMessage = `Not offered during ${term.name}`;
          dialogOptions.infoBarColor = 'error';
        } else if (this.props.course.course.likely_terms.includes(term.quarter)) { // Likely to be offered and not in current term
          dialogOptions.infoBarMessage = `Likely to be offered during ${term.name}`;
        } else { // Unlikely to be offered and not in current term
          dialogOptions.infoBarMessage = `Unlikely to be offered during ${term.name}`;
          dialogOptions.infoBarColor = 'warning';
        }
        this.props.showDialog(DialogTypes.COURSE_INFO, dialogOptions);
      });
    } else {
      this.props.showDialog(DialogTypes.COURSE_INFO, dialogOptions);
    }
  }


  render() {
    return this.props.connectDragSource(
      <div
        className="popover"
        onMouseEnter={() => this.setState({ beingHovered: true })}
        onMouseLeave={() => this.setState({ beingHovered: false })}
        onClick={() => this.showCourseInfoDialog()}
        role="button"
        tabIndex="-1" // 0
      >
        <CourseElement
          size={this.props.size}
          error={this.props.course.fulfilledStatus}
          course={this.catalogCourse}
          beingHovered={this.state.beingHovered}
        />
      </div>,
    );
  }
}

const mapStateToProps = state => ({
  currentTerm: state.time.currTerm,
});

// eslint-disable-next-line new-cap
export default connect(mapStateToProps, { showDialog, setDraggingState })(DraggableUserCourse(ItemTypes.COURSE, source, collect)(UserCourse));
