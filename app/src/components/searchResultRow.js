import React from 'react';
import { Row, Col } from 'reactstrap';

import '../style/searchResultRow.scss';

const SearchResultRow = (props) => {
  return (
    <Row>
      <Col xs="2">{`${props.course.department} ${props.course.number}`}</Col>
      <Col xs="6">{props.course.description}</Col>
      <Col xs="1">{props.course.timeslot}</Col>
      <Col xs="1">{props.course.medians.length ? calcMedian(props.course.medians) : 'N/A'}</Col>
      <Col xs="2">
        <div className="distribs">
          <div>{props.course.distrib}</div>
          <div>{props.course.wc}</div>
        </div>
      </Col>
    </Row>
  );
};

// calculates the average course median
// given all median results over several terms
const calcMedian = (medians) => {
  let sum = 0;
  medians.forEach((med) => {
    sum += med.avg_numeric_value;
  });
  return sum / medians.length;
};

export default SearchResultRow;
