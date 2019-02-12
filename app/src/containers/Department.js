import React from 'react';
import { Heading } from 'evergreen-ui';
import {} from 'reactstrap';


export default class Department extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div>
        <Heading size={800} marginTop="default">
      Departments
        </Heading>
        <hr />
      </div>
    );
  }
}
