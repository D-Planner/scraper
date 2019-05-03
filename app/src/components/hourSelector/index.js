import React from 'react';
import './hourSelector.scss';

/* <div className="bucket">
<h1 className="bucket-name">Bucket</h1>
<div className="course-list" />
</div> */
// {bucket.map((course, index) => {
//     return (
//       <DraggableCourse
//         key={course.crn}
//         index={index}
//         course={course}
//       />
//     );
//   })}

/* <select name="cars">
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
              <option value="fiat">Fiat</option>
              <option value="audi">Audi</option>
            </select> */

// timeslots={course.timeslot}

const HourSelector = (props) => {
  return (
  // <p>Hi!</p>
    <select name="cars">
      <option value={props.timeslots}>{props.timeslots}</option>
      <option value="jello">Jello!</option>

      {/*
        //Once timeslots is an array
        {props.timeslots.map((hour) => {
            return (
            <option value="hour">{hour}</option>
            );
        })} */
        }
    </select>
  );
};

export default HourSelector;
