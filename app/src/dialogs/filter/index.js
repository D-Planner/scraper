import React from 'react';
import DialogWrapper from '../dialogWrapper';
import { GenEds } from '../../constants';


class FilterDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choices: GenEds,
    };
  }

  render() {
    console.log(this.state.choices);
    return (
      <DialogWrapper {...this.props}>
        {Object.keys(this.state.choices).map((choice) => {
          return (<div key={choice}>{choice}</div>);
        })}
      </DialogWrapper>
    );
  }
}

export default FilterDialog;
