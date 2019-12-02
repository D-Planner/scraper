import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { HotKeys } from 'react-hotkeys';
import closeButton from '../../style/close.svg';

import './dialogWrapper.scss';

// A wrapper for all dialogs in the application
// Should be used by all other dialogs
// Allowable/required prop types defined at the bottom of this file
class DialogWrapper extends React.Component {
  okButton = this.props.showOk
    ? (
      <button type="button" className="ok-button" onClick={() => this.onOk()} disabled={this.props.okDisabled}>
        <div className="button-text">{this.props.okText}</div>
      </button>
    ) : null;

  noButton = this.props.showNo
    ? (
      <button type="button" className="ok-button" onClick={() => this.onNo()} disabled={this.props.noDisabled}>
        <div className="button-text">{this.props.noText}</div>
      </button>
    ) : null;

  size = classNames({
    'sz-small': this.props.size === 'sm',
    'sz-medium': this.props.size === 'md',
    'sz-large': this.props.size === 'lg',
    'dialog-container': true,
  });

  keyMap = {
    OK: 'Enter',
    CLOSE: 'Escape',
  };

  handlers = {
    OK: () => this.onOk(),
    CLOSE: () => {
      console.log('closing...');
      this.props.hideDialog();
    },
  };

  constructor(props) {
    super(props);

    this.onOk = this.onOk.bind(this);
    this.onNo = this.onNo.bind(this);

    this.popupRef = React.createRef();
    this.okPopupRef = React.createRef();
  }

  componentDidMount() {
    this.popupRef.current.focus();
  }

  onOk = () => {
    console.log('onOk');
    this.props.onOk();
    this.props.hideDialog();
  };

  onNo = () => {
    console.log('onNo');
    this.props.onNo();
    this.props.hideDialog();
  };

  handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      console.log('handleBackgroundClick');
      console.log(this.props.hideDialog());
    }
  };

  render = () => {
    console.log(this.props);
    return (
      <div onClick={this.handleBackgroundClick} className="dialog-background" role="presentation">
        <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
          {this.props.infoBarMessage ? <div className="dialog-info-bar"><div className="dialog-info">{this.props.infoBarMessage}</div></div> : null}
          <div className={this.size} ref={this.popupRef} tabIndex={-1}>
            <div className="dialog-header">
              <h1 className="dialog-title">{this.props.title}</h1>
              <button type="button" onClick={this.props.hideDialog} className="close-button">
                <img src={closeButton} alt="close" />
              </button>
            </div>
            {this.props.message ? <div className="dialog-message">{this.props.message}</div> : null}
            {this.props.children}
            <div className="dialog-actions">
              {this.noButton}
              {this.props.showNo ? <div className="dialog-button-spacer" /> : null}
              {this.okButton}
            </div>
          </div>
        </HotKeys>
      </div>
    );
  }
}

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
  /** whether to display the no button with the onNo action */
  showNo: PropTypes.bool,
  /** text to render on the no button */
  noText: PropTypes.string,
  /** whether to disable the no button if it is shown */
  noDisabled: PropTypes.bool,
  /** the size of the dialog box, as one of sm, md, or lg */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** a generic message */
  message: PropTypes.string,
  /** a generic message for top of dialog */
  infoBarMessage: PropTypes.string,

  // methods
  /** hides the dialog */
  hideDialog: PropTypes.func.isRequired,
  /** callback to call when the ok button is pressed */
  onOk: PropTypes.func,
  /** callback to call when the no button is pressed */
  onNo: PropTypes.func,
};

DialogWrapper.defaultProps = {
  title: '',
  showOk: true,
  okText: 'Ok',
  okDisabled: false,
  showNo: false,
  noText: 'Cancel',
  noDisabled: false,
  size: 'sm',
  message: null,
  infoBarMessage: null,
  onOk: () => {},
  onNo: () => {},
};

const mapStateToProps = state => ({
  focusOnClose: state.dialog.focusOnClose,
});

export default connect(mapStateToProps)(DialogWrapper);
