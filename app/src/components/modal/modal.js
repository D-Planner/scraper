import React from 'react';
import './modal.scss';

const Modal = ({
  handleClose, show, children, text,
}) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button type="button" onClick={handleClose}>{text}</button>
      </section>
    </div>
  );
};

export default Modal;
