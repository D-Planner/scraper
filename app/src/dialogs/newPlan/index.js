import React, { Component, useState } from 'react';
import DialogWrapper from '../dialogWrapper';

import './newPlan.scss';

/** allows a user to name and create a new plan */
class NewPlan extends Component {
  // const [text, setText] = useState('');

  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };

    this.newPlanInputRef = React.createRef();
  }

  componentDidMount() {
    this.newPlanInputRef.current.focus();
  }

  setText(text, e) {
    this.setState({ text });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      try {
        this.props.onOk(this.state.text);
      } catch (err) {
        console.log('error in newplan');
        console.error(err);
      }
      this.props.hideDialog();
    } else if (e.key === 'Escape') {
      this.props.hideDialog();
    }
  }

  render() {
    return (
      <DialogWrapper {...this.props} onOk={() => { this.props.onOk(this.state.text); }}>
        <div className="new-plan-content">
          <div className="description">Give your new plan a name.</div>
          <input
            type="text"
            placeholder="Untitled plan"
            className="new-plan-name"
            onChange={(e) => { this.setText(e.target.value); }}
            onKeyDown={(e) => { this.handleKeyDown(e); }}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            ref={this.newPlanInputRef}
            // onKeyDown={(e) => { if (e.keyCode === 13) { console.log(e.target.value); props.onOk(); } }}
          />
        </div>
      </DialogWrapper>
    );
  }
}

export default NewPlan;
