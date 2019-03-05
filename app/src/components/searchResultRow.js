import React from 'react';
import { Row, Col } from 'reactstrap';

import '../style/searchResultRow.scss';

const SearchResultRow = (props) => {
  return (
    <div className="result-row">
      <Row>
        <Col xs="2">
          <div className="name result-col">
            {`${props.course.department} ${props.course.number}`}
          </div>
        </Col>
        <Col xs="6">
          <div className="description result-col">
            <div className="description-text">
              {props.course.description}
            </div>
          </div>
        </Col>
        <Col xs="1">
          <div className="period result-col">
            {props.course.timeslot}
          </div>
        </Col>
        <Col xs="1">
          <div className="median result-col">
            {props.course.medians.length ? calcMedian(props.course.medians) : 'N/A'}
          </div>
        </Col>
        <Col xs={{ size: 1, offset: 1 }}>
          <div className="distribs result-col">
            <div>{props.course.distrib}</div>
            <div>{props.course.wc}</div>
          </div>
        </Col>
      </Row>
    </div>
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
