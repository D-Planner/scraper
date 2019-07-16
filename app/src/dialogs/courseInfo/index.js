import React, { Component } from 'react';
import { connect } from 'react-redux';
import DialogWrapper from '../dialogWrapper';
// import bookmarkFilled from '../../style/bookmarkFilled.svg';
import { addCourseToFavorites, addCourseToPlacements } from '../../actions';
import checkedBox from '../../style/checkboxChecked.svg';
import bookmark from '../../style/bookmark.svg';

import './courseInfo.scss';

const Dependencies = {
  req: 'Required (One of):',
  range: 'Required',
  grade: 'High Grade in:',
  rec: 'Reccomended',
};

/** displays information on a course -- displayed when a draggable course is clicked without dragging */
class CourseInfoDialog extends Component {
  /**
   * Handles rendering of distributive bubbles.
   * THIS FEATURE IS NOT COMPLETE, DEPENDENT ON MAKING [distrib] and [wc] BEINGS ARRAYS
   */
  renderDistribs = (course) => {
    // const distribTypesNames = distribTypes.map(distrib => distrib.name);
    const distribs = [];
    const wcs = [];
    if (course.distribs !== null) {
      course.distribs.forEach((distrib) => {
        if (distrib === 'W' || distrib === 'NW' || distrib === 'CI') {
          wcs.push(distribTypes.find(ref => ref.name === distrib));
        } else {
          distribs.push(distribTypes.find(ref => ref.name === distrib));
        }
      });
    }
    return (
      <div id="distribs">
        <div className="section-header">Distributives</div>
        <div id="bubbles">
          {distribs.map((distrib) => {
            return (
              <img key={distrib.name} className="distrib-icon" src={distrib.icon} alt={distrib.name} />
            );
          })}
          {(wcs.length === 0 || distribs.length === 0) ? null : <div className="vertical-divider" />}
          {wcs.map((wc) => {
            return (
              <img key={wc.name} className="wc-icon" src={wc.icon} alt={wc.name} />
            );
          })}
        </div>

      </div>
    );
  }

  /**
   * Handles rendering of medians, cuts off after 5 terms.
   * @param {Array} medians
   */
  renderMedians = (medians) => {
    if (medians !== null) {
      let cutOff = medians.length;
      if (medians.length > 5) cutOff = 5;
      return (
        <div id="medians">
          <div className="section-header">Medians</div>
          <div id="bubbles">
            {
            medians.slice(0, cutOff).map((median) => {
              return (
                <div key={median.term} className="median-bubble">
                  <div className="median-bubble-grade">{median.courses[0].median}</div>
                  <div className="median-bubble-term">{median.term}</div>
                </div>
              );
            })
          }
          </div>
        </div>
      );
    } else {
      return (
        <div id="medians">
          <div className="section-header">Medians</div>
          <div>
          No medians available.
          </div>
        </div>
      );
    }
  }

  /**
   * Handles rendering of scores.
   * @param {*} course
   */
  renderScores = (course) => {
    return (
      <div id="scores">
        <div className="section-header">Scores</div>
        <div>
          Layup-list Score: {course.layup_score}
        </div>
        <div>
          Quality Score: {course.quality_score}
        </div>
      </div>
    );
  }

  /**
   * Handles rendering of the description.
   * @param {String} description
   */
  renderDescription = (description) => {
    return (
      <div id="description">
        <div className="section-header">Description</div>
        {description}
      </div>
    );
  }

  /**
   * Handles rendering of information for next term, if offered.
   * THIS FEATURE IS NOT COMPLETE, DEPENDENT ON HAVING A UNIVERSAL TERM ON OUR API SERVER
   * THIS FEATURE IS NOT COMPLETE, DEPENDENT ON FIXING THE [timeslot] PROPERTY.
   * @param {*} course
   * @param {String} nextTerm
   */
  renderNextTerm = (course, nextTerm) => {
    if (nextTerm === course.term) {
      return (
        <div id="next-term">
          <div className="section-header">Offered Next Term</div>
          <div id="offerings">
            <span>{course.timeslot} - hour</span>
            <span>2A - hour</span>
          </div>
        </div>
      );
    } else return null;
  }

  /**
   * Test for Professors
   *
   *
   */
  renderProfessors = (professors) => {
    return (
      <div id="professors">
        <div className="section-header">Professors</div>
        {professors.map((p) => {
          return (
            <div className="professor">{p.name}</div>
          );
        })}
      </div>
    );
  }

  renderPrerequisites = (course) => {
    console.log(this.props);
    const { prerequisites } = course;
    return (
      <div id="dependenciesContainer">
        <div className="section-header">Prerequisites</div>
        <div id="dependencies">
          {prerequisites.map((o) => {
            const dependencyType = Object.keys(o).find((key) => {
              return (o[key].length > 0 && key !== '_id');
            });

            const render = (
              <div className="dependency">
                <div className="section-header">{Dependencies[dependencyType]}</div>
                {(dependencyType === 'range') ? (
                  <div>
                    One from {course.department} {o[dependencyType][0]} {(o[dependencyType][1] === 300) ? '+' : ` - ${o[dependencyType][1]}`}
                  </div>
                ) : o[dependencyType].map((c) => {
                  return (
                    <div className="course bg">
                      <div className="title-box">
                        <div className="course-left">
                          {`${c.department} ${c.number}`}
                        </div>
                        <div className="spacer" />
                        <div className="course-right">
                          <div className="name">
                            {c.name}
                          </div>
                          <div className="check-box">
                            <img className="bookmark" src={bookmark} alt="bookmark" onClick={addCourseToFavorites(c.id)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
            if (!this.props.previousCourses) return render;
            switch (dependencyType) {
              case 'req':
                return (o[dependencyType].some((c) => {
                  return (this.props.previousCourses) ? this.props.previousCourses.map(p => p._id).includes(c._id) : false;
                })) ? <img src={checkedBox} alt="fulfilled" /> : render;
              case 'range':
                return (this.props.previousCourses.some((c) => {
                  console.log(c);
                  return (o[dependencyType][0] <= c.number && c.number <= o[dependencyType][1] && c.department === course.department);
                })) ? <img src={checkedBox} alt="fulfilled" /> : render;
              default:
                return render;
            }
          })}
        </div>
      </div>
    );
  }

  courseUserOptions() {
    console.log(this.props);
    return (
      <div>
        <p onClick={() => {
          this.props.addCourseToPlacements(this.props.data._id);
        }}
        > Add this to your placements
        </p>
      </div>
    );
  }

  /**
   * Master handlers for all information about the course.
   * @param {*} course
   * @param {String} nextTerm
   */
  courseInfo(course, nextTerm) {
    return (
      <div id="content">
        <div id="major">Engineering Department: Prerequisite</div>
        <hr className="horizontal-divider" />
        <div id="first">{this.renderNextTerm(course, nextTerm)}{this.renderDescription(course.description)}</div>
        <hr className="horizontal-divider" />
        <div id="metrics">
          {this.renderDistribs(course)}
          {this.renderMedians(course.medians)}
          {this.renderScores(course)}
        </div>
        <hr className="horizontal-divider" />
        <div id="last">
          {this.renderPrerequisites(course)}
          {this.renderProfessors(course.professors)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <DialogWrapper {...this.props}>
        {this.courseUserOptions()}
        {this.courseInfo(this.props.data, this.props.nextTerm)}
      </DialogWrapper>
    );
  }
}

// import all svgs in from require.context, found later
const importSVGs = (r) => {
  const icons = {};
  r.keys().forEach((item) => {
    // strip extension and ./ at beginning of file
    const itemName = item.replace('./', '').replace('.svg', '');

    // require the icon and insert its reference into the icons dictionary
    icons[itemName] = r(item);
  });
  return icons;
};

// import all svg files in the ../style/distrib_icons directory
const icons = importSVGs(require.context('../../style/distrib_icons', false, /\.svg$/));

const distribTypes = [
  {
    fullName: 'Arts',
    name: 'ART',
    icon: icons.art,
    fulfills: false,
  },
  {
    fullName: 'Literature',
    name: 'LIT',

    icon: icons.lit,
    fulfills: false,
  },
  {
    fullName: 'Thought, Meaning, and Value',
    name: 'TMV',
    icon: icons.tmv,
    fulfills: false,
  },
  {
    fullName: 'International or Comparative Study',
    name: 'INT',
    icon: icons.int,
    fulfills: false,
  },
  {
    fullName: 'Social Analysis',
    name: 'SOC',
    icon: icons.soc,
    fulfills: false,
  },
  {
    fullName: 'Quantitative and Deductive Science',
    name: 'QDS',
    icon: icons.qds,
    fulfills: false,
  },
  {
    fullName: 'Natural and Physical Science (LAB)',
    name: 'SLA',
    icon: icons.sla,
    fulfills: false,
  },
  {
    fullName: 'Natural and Physical Science',
    name: 'SCI',
    icon: icons.sci,
    fulfills: false,
  },
  {
    fullName: 'Technology and Applied Science (LAB)',
    name: 'TLA',
    icon: icons.tla,
    fulfills: false,
  },
  {
    fullName: 'Technology and Applied Science',
    name: 'TAS',
    icon: icons.tas,
    fulfills: false,
  },
  {
    fullName: 'Western Cultures',
    name: 'W',
    icon: icons.wc_w,
    fulfills: false,
  },
  {
    fullName: 'Non-Western Cultures',
    name: 'NW',
    icon: icons.wc_nw,
    fulfills: false,
  },
  {
    fullName: 'Culture and Identity',
    name: 'CI',
    icon: icons.wc_ci,
    fulfills: false,
  },
];


const mapStateToProps = state => ({
  nextTerm: state.time.nextTerm,
});

export default connect(mapStateToProps, { addCourseToPlacements })(CourseInfoDialog);
