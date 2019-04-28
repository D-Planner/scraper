import React, { useState } from 'react';
import DialogWrapper from '../dialogWrapper';

import './newPlan.scss';

const NewPlan = (props) => {
  const [text, setText] = useState('');

  return (
    <DialogWrapper {...props} onOk={() => { props.onOk(text); }}>
      <div className="new-plan-content">
        <div className="description">Give your new plan a name, you can change this later:</div>
        <input
          type="text"
          placeholder="Untitled plan"
          className="new-plan-name"
          onChange={(e) => { setText(e.target.value); }}
        />
      </div>
    </DialogWrapper>
  );
};

export default NewPlan;
