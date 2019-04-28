import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import closeButton from '../../style/close.svg';

import './dialogWrapper.scss';

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
          <button type="button" onClick={handleBackgroundClick} className="close-button">
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
  title: PropTypes.string,
  showOk: PropTypes.bool,
  okText: PropTypes.string,
  okDisabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),

  // methods
  hideDialog: PropTypes.func.isRequired,
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
