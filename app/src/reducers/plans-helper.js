const [ERROR, WARNING, CLEAR] = ['error', 'warning', ''];

function getFlattenedCourses(propsPlan) {
  const courses = [];
  propsPlan.terms.forEach((year) => {
    year.forEach((term) => {
      courses.push(...term.courses);
    });
  });
  return courses;
}

function getFlattenedTerms(propsPlan) {
  const terms = [];
  propsPlan.terms.forEach((y) => {
    y.forEach((term) => {
      terms.push(term);
    });
  });
  return terms;
}

// This still isn't working
function setAllFulfilledStatus(termID, userCourseID, propsUser, state) {
  try {
    getFlattenedTerms().forEach((term) => {
      if (term._id === termID) {
        const previousCourses = getFlattenedTerms().filter((t) => {
          return t.index <= term.index;
        }).map((t) => {
          return t.previousCourses;
        }).flat()
          .map((t) => { return t.toString(); });
        const prevCourses = [...new Set((propsUser.placement_courses && propsUser.placement_courses.length)
          ? propsUser.placement_courses.map((c) => { return c._id.toString(); }).concat(previousCourses)
          : previousCourses)];

        getFlattenedCourses().forEach((userCourse) => {
          if (userCourse.id === userCourseID) {
            const getValue = (uCourse) => {
              const { course } = uCourse;
              let prereqs = course.prerequisites ? course.prerequisites : [];
              if (!prereqs || prereqs.length === 0) {
                return CLEAR;
              }
              prereqs = prereqs.map((o) => {
                let dependencyType = Object.keys(o).find((key) => {
                  return (o[key].length > 0 && key !== '_id');
                });
                if (!dependencyType && Object.keys(o).includes('abroad')) dependencyType = 'abroad';

                const prevCoursesIncludes = () => {
                  return o[dependencyType].map((c) => { return c.id.toString(); })
                    .some((id) => {
                      return (prevCourses.length) ? prevCourses.includes(id) : false;
                    });
                };

                switch (dependencyType) {
                  case 'abroad':
                    return WARNING;
                  case 'req':
                    return prevCoursesIncludes() ? CLEAR : ERROR;
                  case 'range':
                    return (prevCourses.some((c) => {
                      return (o[dependencyType][0] <= c.number && c.number <= o[dependencyType][1] && c.department === this.course.department);
                    })) ? CLEAR : ERROR;
                  case 'grade':
                    return prevCoursesIncludes() ? WARNING : ERROR;
                  case 'rec':
                    return prevCoursesIncludes() ? WARNING : ERROR;
                  default:
                    return CLEAR;
                }
              });

              if (prereqs.includes(ERROR)) {
                return ERROR;
              }
              if (prereqs.includes(WARNING)) {
                return WARNING;
              }

              return CLEAR;
            };
            this.props.setFulfilledStatus(userCourse.id, getValue(userCourse));
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
}

export function setPreviousCourses(state) {
  console.log('[setPreviousCourses Dplan.js]');
  const previousByTerm = getFlattenedTerms().map((term) => {
    const prevCourses = [...new Set(getFlattenedTerms()
      .sort((t1, t2) => {
        return t1.index - t2.index;
      })
      .filter((t) => {
        return t.index < term.index;
      })
      .map((t) => {
        return t.courses;
      })
      .flat()
      .filter((c) => {
        return c.fulfilledStatus === '';
      })
      .map((c) => {
        return (c.course.xlist.length) ? [...c.course.xlist.map(xlist => xlist._id), c.course.id] : c.course.id;
      })
      .flat())];
    console.log(prevCourses);
    return { [term._id]: prevCourses };
  });
  previousByTerm.forEach((t) => {
    Object.entries(t).forEach(([term, previousCourses]) => {
      getFlattenedTerms()
        .forEach((x) => {
          if (x._id === String(term)) {
            x.previousCourses = previousCourses;
            x.courses.forEach((course) => {
              console.log('SETFULFILLEDSTATUS', course.course.name);
              setAllFulfilledStatus(x._id, course.id, propsUser, state);
            });
          }
        });
    });
  });
}
