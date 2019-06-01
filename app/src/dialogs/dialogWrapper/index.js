import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import closeButton from '../../style/close.svg';

import './dialogWrapper.scss';

// A wrapper for all dialogs in the application
// Should be used by all other dialogs
// Allowable/required prop types defined at the bottom of this file
const DialogWrapper = (props) => {
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      props.hideDialog();
    }
  };

  const onOk = () => {
    props.onOk();
    props.hideDialog();
  };

  const okButton = props.showOk
    ? (
      <button type="button" className="ok-button" onClick={onOk} disabled={props.okDisabled}>
        <div className="button-text">{props.okText}</div>
      </button>
    ) : null;

  const size = classNames({
    'sz-small': props.size === 'sm',
    'sz-medium': props.size === 'md',
    'sz-large': props.size === 'lg',
    'dialog-container': true,
  });

  return (
    <div onClick={handleBackgroundClick} className="dialog-background" role="presentation">
      <div className={size}>
        <div className="dialog-header">
          <h1 className="dialog-title">{props.title}</h1>
          <button type="button" onClick={props.hideDialog} className="close-button">
            <img src={closeButton} alt="close" />
          </button>
        </div>

        {props.children}

        {okButton}
      </div>
    </div>
  );
};

DialogWrapper.propTypes = {
  // props
  /** the title of the dialog */
  title: PropTypes.string,
  /** whether to display the ok button with the onOk action */
  showOk: PropTypes.bool,
  /** text to render on the ok button */
  okText: PropTypes.string,
  /** whether to disable the ok button if it is shown */
  okDisabled: PropTypes.bool,
  /** the size of the dialog box, as one of sm, md, or lg */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),

  // methods
  /** hides the dialog */
  hideDialog: PropTypes.func.isRequired,
  /** callback to call when the ok button is pressed */
  onOk: PropTypes.func,
};

DialogWrapper.defaultProps = {
  title: '',
  showOk: true,
  okText: 'OK',
  okDisabled: false,
  size: 'sm',
  onOk: () => {},
};

export default DialogWrapper;
