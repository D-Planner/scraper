import React from 'react';
import PropTypes from 'prop-types';

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
      <button type="button" onClick={onOk} disabled={props.okDisabled}>
        {props.okText}
      </button>
    ) : null;

  return (
    <div onClick={handleBackgroundClick} role="presentation">
      <div className="dialog-header">
        <h1>{props.title}</h1>

        <button type="button" onClick={handleBackgroundClick}>
          Close
        </button>
      </div>

      {props.children}

      {okButton}
    </div>
  );
};

DialogWrapper.propTypes = {
  // props
  title: PropTypes.string,
  showOk: PropTypes.bool,
  okText: PropTypes.string,
  okDisabled: PropTypes.bool,

  // methods
  hideDialog: PropTypes.func.isRequired,
  onOk: PropTypes.func,
};

DialogWrapper.defaultProps = {
  title: '',
  showOk: true,
  okText: 'OK',
  okDisabled: false,
  onOk: () => {},
};

export default DialogWrapper;
