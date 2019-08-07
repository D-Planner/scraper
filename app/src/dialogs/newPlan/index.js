import React, { createRef, useEffect, useState } from 'react';
import DialogWrapper from '../dialogWrapper';

import './newPlan.scss';

/** allows a user to name and create a new plan */
const NewPlan = (props) => {
  const [text, setText] = useState('');
  const [gradYear, setGradYear] = useState('');

  const textRef = createRef();
  const gradRef = createRef();

  useEffect(() => {
    textRef.current.focus();
  }, [text]);

  useEffect(() => {
    gradRef.current.focus();
  }, [gradYear]);

  // const GradYearPicker = () => {
  //   const x = [];
  //   let j = new Date().getFullYear() - 5;
  //   while (x.length < 10) {
  //     x.push(j);
  //     j += 1;
  //   }
  //   return (
  //     <select>
  //       {
  //       x.map((e) => {
  //         console.log(e);
  //         return (
  //           <option value={e}>{e}</option>
  //         );
  //       })
  //     }
  //     </select>
  //   );
  // };

  return (
    <DialogWrapper {...props} onOk={() => { props.onOk(text, gradYear); }}>
      <div className="new-plan-content">
        <div className="description">Give your new plan a name, you can change this later:</div>
        <input
          ref={textRef}
          type="text"
          placeholder="Untitled plan"
          className="new-plan-name"
          onChange={(e) => { setText(e.target.value); }}
        />
        <input
          ref={gradRef}
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
