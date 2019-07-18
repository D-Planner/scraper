import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  removeCourseFromFavorites, removePlacement, fetchUser, fetchPlan,
} from '../../actions';
import DialogWrapper from '../dialogWrapper';
import remove from '../../style/close.svg';
import CourseElement from '../../components/staticCourseElement';

import './profile.scss';

class ProfileDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  renderUserInfo = () => {
    return (
      <div className="user">
        <div className="info">
          <div className="label">Name</div>
          <div className="data">
            {this.props.user.full_name}
          </div>
        </div>
        <div className="info">
          <div className="label">Email</div>
          <div className="data">
            {this.props.user.email}
          </div>
        </div>
        <div className="info">
          <div className="label">Placement Courses</div>
          <div className="data">
            {this.renderPlacements()}
          </div>
        </div>
        <div className="info">
          <div className="label">Bookmarked Courses</div>
          <div className="data">
            {this.renderBookmarks()}
          </div>
        </div>

      </div>
    );
  }

  renderBookmarks = () => {
    return (
      this.props.user.favorite_courses.map((c, i) => {
        return (
          <CourseElement
            size="bg"
            course={c}
            action={{
              type: 'remove',
              svg: remove,
              method: () => {
                this.props.removeCourseFromFavorites(c.id).then((r) => {
                  this.props.fetchUser();
                  this.props.fetchPlan(this.props.plan.id);
                }).catch((e) => {
                  console.log(e);
                });
              },
            }}
          />
        );
      })
    );
  }

  renderPlacements = () => {
    return (
      this.props.user.placement_courses.map((c, i) => {
        return (
          <CourseElement
            size="bg"
            course={c}
            action={{
              type: 'remove',
              svg: remove,
              method: () => {
                this.props.removePlacement(c.id).then((r) => {
                  this.props.fetchUser();
                  this.props.fetchPlan(this.props.plan.id);
                }).catch((e) => {
                  console.log(e);
                });
              },
            }}
          />
        );
      })
    );
  }

  render() {
    return (
      <DialogWrapper {...this.props}>
        {this.renderUserInfo()}
      </DialogWrapper>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.current,
  plan: state.plans.current,
});

export default connect(mapStateToProps, {
  removeCourseFromFavorites, removePlacement, fetchUser, fetchPlan,
})(ProfileDialog);
