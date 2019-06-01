import React, { createRef, useEffect, useState } from 'react';
import DialogWrapper from '../dialogWrapper';

import './newPlan.scss';

/** allows a user to name and create a new plan */
const NewPlan = (props) => {
  const [text, setText] = useState('');

  const inputRef = createRef();

  useEffect(() => {
    inputRef.current.focus();
  });

  return (
    <DialogWrapper {...props} onOk={() => { props.onOk(text); }}>
      <div className="new-plan-content">
        <div className="description">Give your new plan a name, you can change this later:</div>
        <input
          ref={inputRef}
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
