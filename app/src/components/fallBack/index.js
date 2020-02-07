import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { DialogTypes, metaContentSeparator, universalMetaTitle } from '../../constants';
import { getRandomCourse, showDialog } from '../../actions';

class FallBack extends Component {
  componentDidMount() {
    this.props.getRandomCourse().then(() => {
      console.log(this.props.randomCourse);
      this.showCourseInfoDialog(this.props.randomCourse);
    }).catch((e) => {
      console.log(e);
    });
  }

  /**
   * Sends off information for [dialogOrchestrator].
   * THIS FEATURE IS NOT COMPLETE, NEED TO BUILD SPECIAL RENDERING DEPENDING ON USER CHOICES OF [hour] AND [distribs].
   * @param {*} props
   */
  showCourseInfoDialog = (course) => {
    console.log(course);
    const dialogOptions = {
      title: `${course.department} ${course.number}: ${course.name}`,
      size: 'lg',
      data: course,
      showOk: false,
    };
    this.props.showDialog(DialogTypes.COURSE_INFO, dialogOptions);
  };

  render() {
    return (
      <div className="container">
        <Helmet>
          <title>404, That’s an error!{metaContentSeparator}{universalMetaTitle}</title>
        </Helmet>
        <div>Unknown Path</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  randomCourse: state.courses.random_course,
});

// export default withRouter(connect(mapStateToProps, {
//   fetchPlan, deletePlan, updateTermInCurrentPlan, showDialog,
// })(DPlan));
// eslint-disable-next-line new-cap
// export default TermTarget(ItemTypes.COURSE, termTarget, collect)(Term);
// eslint-disable-next-line new-cap
export default connect(mapStateToProps, { getRandomCourse, showDialog })(FallBack);
