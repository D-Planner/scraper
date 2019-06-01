import React, { useState } from 'react';
import DialogWrapper from '../dialogWrapper';

import './declareMajor.scss';

/** allows a user to declare a new major */
const DeclareMajor = (props) => {
  const [selectedMajor, setSelectedMajor] = useState(null);
  return (
    <DialogWrapper {...props} onOk={() => props.onOk(selectedMajor)}>
      <div className="declare-major-content">
        <div className="description">Please choose a new major to declare:</div>
        <ul>
          {props.majors.map((major) => {
            return (
              <li key={major.id}>
                <div>
                  <input
                    type="radio"
                    value={major.id}
                    checked={selectedMajor === major.id}
                    onChange={e => setSelectedMajor(e.target.value)}
                  />
                  {major.name}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </DialogWrapper>
  );
};

export default DeclareMajor;
