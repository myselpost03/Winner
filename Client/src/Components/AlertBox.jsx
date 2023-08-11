import React from 'react';
import './AlertBox.scss';

const AlertBox = ({ message, onClose }) => {
  return (
    <div className="custom-alert-box">
      <div className="custom-alert-box-content">
        <p className='message'>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default AlertBox;
