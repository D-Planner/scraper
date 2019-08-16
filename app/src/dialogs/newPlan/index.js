import React, { useState } from 'react';
import DialogWrapper from '../dialogWrapper';

import './newPlan.scss';

/** allows a user to name and create a new plan */
const NewPlan = (props) => {
  const [text, setText] = useState('');
  const [gradYear, setGradYear] = useState('');


  return (
    <DialogWrapper {...props} onOk={() => { props.onOk(text, gradYear); }}>
      <div className="new-plan-content">
        <div className="description">Give your new plan a name, you can change this later:</div>
        <input
          type="text"
          placeholder="Untitled plan"
          className="new-plan-name"
          onChange={(e) => { setText(e.target.value); }}
        />
        <input
          type="number"
          placeholder="Graduation Year (xxxx)"
          className="new-plan-name"
          onChange={(e) => { setGradYear(e.target.value); }}
        />

      </div>
    </DialogWrapper>
  );
};

export default NewPlan;
