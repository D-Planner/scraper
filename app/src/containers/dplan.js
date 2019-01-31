import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import classNames from 'classnames';

import Term from '../components/term';

import './dplan.scss';

const data = [
  {
    id: 1,
    year: '2015-2016',
    terms: [
      {
        id: 1,
        name: '15F',
        off_term: false,
        courses: [
          {
            id: 'randomstring1',
            subject: 'COSC',
            number: '1',
            title: 'Intro Programming Computatn',
            timeslot: '2',
          },
          {
            id: 'randomstring2',
            subject: 'MUS',
            number: '20',
            title: 'Intro to Music Theory',
            timeslot: '10',
          },
          {
            id: 'randomstring3',
            subject: 'JAPN',
            number: '1',
            title: 'First Yr Course in Japanese',
            timeslot: '9S',
          },
        ],
      },
      {
        id: 2,
        name: '16W',
        off_term: false,
        courses: [],
      },
      {
        id: 3,
        name: '16S',
        off_term: false,
        courses: [],
      },
      {
        id: 4,
        name: '16X',
        off_term: true,
        courses: [],
      },
    ],
  },
  {
    id: 2,
    year: '2016-2017',
    terms: [
      {
        id: 5,
        name: '16F',
        off_term: false,
        courses: [],
      },
      {
        id: 6,
        name: '17W',
        off_term: false,
        courses: [],
      },
      {
        id: 7,
        name: '17S',
        off_term: false,
        courses: [],
      },
      {
        id: 8,
        name: '17X',
        off_term: false,
        courses: [],
      },
    ],
  },
];

export default class DPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const containerClass = classNames({
      ctnr: true,
    });
    return (
      <div className={containerClass}>
        <Container>
          {data.map((year) => {
            return (
              <Row key={year.id}>
                {year.terms.map((term) => {
                  return (
                    <Col xs="12" md="3" className="px-0" key={term.id}>
                      <Term name={term.name} offTerm={term.off_term} courses={term.courses} />
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </Container>
      </div>
    );
  }
}
