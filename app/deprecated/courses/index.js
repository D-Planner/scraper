import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchCourses } from '../../src/actions';
import LoadingWheel from '../../src/components/loadingWheel';

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };

    this.renderCourses = this.renderCourses.bind(this);
  }

  componentWillMount() {
    this.props.fetchCourses().then(() => this.setState({ loading: false }));
  }

  renderCourses() {
    if (this.state.loading === true) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'center', textAlign: 'center',
        }}
        >
          <LoadingWheel style={{ margin: 'auto' }} />
        </div>
      );
    } else {
      return (
        this.props.allCourses.map((course) => {
          return (
            <div>
              <section>
                {course.name}
                {course.department}
                {course.number}
              </section>
              <section>
                <p>{course.description}</p>
                {/* <p>{course.term}</p> */}
                {/* <p>{course.crn}</p> */}
                {/* <p>{course.section}</p> */}
                {/* {course.xlist.length > 0 ? <p>{course.xlist.join(', ')}</p> : <p />} */}
                {/* <p>{course.wc}</p> */}
                {/* <p>{course.distrib}</p> */}
                {/* <p>{course.building}</p> */}
                {/* <p>{course.room}</p> */}
                <p>Terms offered:   {course.terms_offered ? course.terms_offered.join(', ') : 'Unknown'}</p>
                {/* <p>{course.professors ? course.professors.join(', ') : 'Unknown'}</p> */}
                {/* <p>{course.enrollment_limit}</p> */}
                {/* <p>{course.current_enrollment}</p> */}
                {/* <p>{course.status}</p> */}
              </section>
            </div>
          );
        })
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderCourses()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allCourses: state.courses.all,
});

export default withRouter(connect(mapStateToProps, { fetchCourses })(Courses));
