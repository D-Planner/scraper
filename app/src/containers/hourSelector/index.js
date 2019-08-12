import React, { useState, useEffect } from 'react';
import './hourSelector.scss';

const HourSelector = (props) => {
  const [timeslot, setTimeslot] = useState(props.course.timeslot);

  useEffect(() => {
    props.updateUserCourse(props.course.id, { timeslot });
  }, [timeslot]);

  const hours = () => {
    return (
      <select value={timeslot} onChange={e => setTimeslot(e.target.value)} className={(props.past) ? 'past' : ''}>
        {props.timeslots.map((hour) => {
          return (
            <option key={hour} value={hour}>{(hour === 'other') ? 'OTH' : hour}</option>
          );
        })}
      </select>
    );
  };

  return (
    <div className="hourSelector">
      {hours()}
    </div>
  );
};

export default HourSelector;
