import React from 'react';
import './hourSelector.scss';

const HourSelector = (props) => {
  let hours = (
    <select disabled>\
      <option value="N/A">N/A</option>\
    </select>
  );
  if (props.timeslots) {
    hours = (
      <select className="hourSelector"> {props.timeslots.map((hour) => {
        if (hour === 'other') hour = 'OTH';
        return (
          <option value={hour}>{hour}</option>
        );
      })}
      </select>
    );
  }

  return (
    <div className="hourSlector">
      {hours}
    </div>

  );
};

export default HourSelector;
