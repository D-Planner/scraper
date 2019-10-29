import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  removeCourseFromFavorites, removePlacement, fetchUser, fetchPlan, updateUser, fetchPlans, showDialog,
} from '../../actions';
import DialogWrapper from '../dialogWrapper';
import NonDraggableCourse from '../../components/nonDraggableCourse';

import { DialogTypes } from '../../constants';
import edit from '../../style/edit.svg';
import check from '../../style/check.svg';
import './profile.scss';

const editOptions = {
  'First Name': 'firstName',
  'Last Name': 'lastName',
  Email: 'email',
  'Graduation Year': 'graduationYear',
};

class ProfileDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldGradYear: this.props.user.graduationYear,
      editingFirstName: false,
      editingLastName: false,
      editingEmail: false,
      editingGraduationYear: false,
    };

    this.newUser = this.props.user;
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    Object.entries(editOptions).map(([k, v]) => {
      this.setState({ [v]: false }); return null;
    });
  }

  handleChange = (e, type) => {
    this.newUser[e.target.name] = e.target.value;

    if (e.target.name === 'firstName' || e.target.name === 'lastName') {
      this.newUser.full_name = `${this.newUser.firstName} ${this.newUser.lastName}`;
    }
  }

  handleToggleEdit = (v) => {
    let shouldUpdate = false;
    if (this.state[v]) {
      if (this.state.oldGradYear !== this.newUser.graduationYear) {
        const dialogOptions = {
          title: 'Warning',
          message: 'If you change your grad year, all your plans will reset.',
          size: 'sm',
          okText: 'Continue',
          noText: 'Abort',
          showNo: true,
          onOk: () => {
            this.props.updateUser(this.newUser).then(() => {
              this.props.fetchPlans().then(() => {
                window.location.reload();
              });
            });
            console.log('deleting all plans...');
          },
          onNo: () => {
            console.log('user declined to update profile, change nothing');
          },
        };
        this.props.showDialog(DialogTypes.NOTICE, dialogOptions);
      } else {
        shouldUpdate = true;
      }
      if (shouldUpdate) {
        this.props.updateUser(this.newUser);
      }
    }

    this.setState(prevState => ({
      [v]: !prevState[v],
    }));
  }

  displayEditOption = (text, inputName, editing) => {
    return (
      <div className="info">
        <div className="label">{text}:</div>
        <div className="data">
          {!editing ? `${this.newUser[inputName]}`
            : <input type="text" defaultValue={this.newUser[inputName]} name={inputName} onChange={this.handleChange} />}
        </div>
        {!editing ? <img src={edit} alt="edit" onClick={() => this.handleToggleEdit(inputName)} />
          : <img src={check} alt="edit" onClick={() => this.handleToggleEdit(inputName)} />}
      </div>
    );
  }

  renderUserInfo = () => {
    return (
      <div className="user">
        <div className="profile-left">
          {Object.entries(editOptions).map(([k, v]) => {
            return (this.displayEditOption(k, v, this.state[v]));
          })}
        </div>
        <div className="profile-right">
          <div className="placements">
            <div className="placements-label">Placement Courses</div>
            <div className="placements-data">
              {this.renderPlacements()}
            </div>
          </div>
        </div>

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
            currTerm={this.props.currTerm}
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
  currTerm: state.time.currTerm,
});

export default (connect(mapStateToProps, {
  removeCourseFromFavorites, removePlacement, fetchUser, fetchPlan, updateUser, fetchPlans, showDialog,
})(ProfileDialog));
