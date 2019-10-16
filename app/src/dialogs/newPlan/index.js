import React, { useState } from 'react';
import DialogWrapper from '../dialogWrapper';

import './newPlan.scss';

/** allows a user to name and create a new plan */
const NewPlan = (props) => {
  const [text, setText] = useState('');


  return (
    <DialogWrapper {...props} onOk={() => { props.onOk(text); }}>
      <div className="new-plan-content">
        <div className="description">Give your new plan a name.</div>
        <input
          type="text"
          placeholder="Untitled plan"
          className="new-plan-name"
          onChange={(e) => { setText(e.target.value); }}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </div>
    </DialogWrapper>
  );
};

export default NewPlan;
