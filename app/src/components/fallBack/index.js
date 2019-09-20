import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DialogTypes } from '../../constants';
import { getRandomCourse, showDialog } from '../../actions';

import image from '../../style/404-image.png';
import './fallBack.scss';

class FallBack extends Component {
  componentDidMount() {
    // this.props.getRandomCourse().then(() => {
    //   console.log(this.props.randomCourse);
    //   this.showCourseInfoDialog(this.props.randomCourse);
    // }).catch((e) => {
    //   console.log(e);
    // });
  }

  // /**
  //  * Sends off information for [dialogOrchestrator].
  //  * THIS FEATURE IS NOT COMPLETE, NEED TO BUILD SPECIAL RENDERING DEPENDING ON USER CHOICES OF [hour] AND [distribs].
  //  * @param {*} props
  //  */
  // showCourseInfoDialog = (course) => {
  //   console.log(course);
  //   const dialogOptions = {
  //     title: `${course.department} ${course.number}: ${course.name}`,
  //     size: 'lg',
  //     data: course,
  //     showOk: false,
  //   };
  //   this.props.showDialog(DialogTypes.COURSE_INFO, dialogOptions);
  // };

  // render() {
  //   return (
  //     <div>
  //       Unknown Path
  //     </div>
  //   );
  // }

  goHome = () => {
    this.props.history.push('/');
  }

  // Change once form is instated
  reportError = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdb0ab3jGmEe4nS5bL8H_tFN3_buyi0Jdsk6_CrOI23WWRp0g/viewform');
  }

  // Fix error reporting location
  render() {
    return (
      <div className="container">
        <button type="button" className="report-error" onClick={this.reportError}>Report an Error</button>
        <div className="spacer" />
        <div className="title">Uh oh...</div>
        <img src={image} className="image" alt="404-error" />
        <div className="subtitle">Your page doesn&#39;t seem to be available...</div>
        <button type="button" className="home" onClick={this.goHome}>Go Home</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  randomCourse: state.courses.random_course,
});

// export default withRouter(connect(mapStateToProps, {
//   fetchPlan, deletePlan, updateTerm, showDialog,
// })(DPlan));
// eslint-disable-next-line new-cap
// export default TermTarget(ItemTypes.COURSE, termTarget, collect)(Term);
// eslint-disable-next-line new-cap
export default connect(mapStateToProps, { getRandomCourse, showDialog })(FallBack);
