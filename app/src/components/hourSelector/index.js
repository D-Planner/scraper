import React from 'react';
import './hourSelector.scss';

const HourSelector = (props) => {
  return (
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
