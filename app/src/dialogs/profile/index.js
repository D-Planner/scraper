import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  removeCourseFromFavorites, removePlacement, fetchUser, fetchPlan, updateUser, fetchPlans,
} from '../../actions';
import DialogWrapper from '../dialogWrapper';
import NonDraggableCourse from '../../components/nonDraggableCourse';

import './profile.scss';

class ProfileDialog extends Component {
  constructor(props) {
    super(props);


    this.newUser = this.props.user;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e) => {
    if (e.target.name === 'graduationYear') {
      // Render Error Message here
    }
    this.newUser[e.target.name] = e.target.value;
  }

  renderUserInfo = () => {
    return (
      <div className="user">
        <div className="info">
          <div className="label">Name</div>
          <div className="data">
            <input type="text" defaultValue={this.newUser.full_name} name="full_name" onChange={this.handleChange} />
          </div>
        </div>
        <div className="info">
          <div className="label">Email</div>
          <div className="data">
            <input type="email" defaultValue={this.newUser.email} name="email" onChange={this.handleChange} />
          </div>
        </div>
        <div className="info">
          <div className="label">
            Graduation Year
            <div className="sub_label warning">Changing your graduation year will delete your plans</div>
          </div>
          <div className="data">
            <input id="grad" type="number" defaultValue={this.newUser.graduationYear} name="graduationYear" onChange={this.handleChange} />
          </div>
        </div>
        <div className="info">
          <div className="label">Placement Courses</div>
          <div className="data">
            {this.renderPlacements()}
          </div>
        </div>
        <input type="button"
          value="Update"
          onClick={() => {
            this.props.updateUser(this.newUser).then(() => {
              this.props.fetchPlans().then(() => {
                window.location.reload();
              });
            });
          }}
        />
      </div>
    );
  }

  // renderBookmarks = () => {
  //   return (
  //     this.props.user.favorite_courses.map((c, i) => {
  //       return (
  //         <CourseElement
  //           size="bg"
  //           course={c}
  //           action={{
  //             type: 'remove',
  //             svg: remove,
  //             method: () => {
  //               this.props.removeCourseFromFavorites(c.id).then((r) => {
  //                 this.props.fetchUser();
  //                 this.props.fetchPlan(this.props.plan.id);
  //               }).catch((e) => {
  //                 console.log(e);
  //               });
  //             },
  //           }}
  //         />
  //       );
  //     })
  //   );
  // }

  renderPlacements = () => {
    return (
      this.props.user.placement_courses.map((c, i) => {
        return (
          <NonDraggableCourse
            key={i.toString()}
            course={c}
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

export default (connect(mapStateToProps, {
  removeCourseFromFavorites, removePlacement, fetchUser, fetchPlan, updateUser, fetchPlans,
})(ProfileDialog));
