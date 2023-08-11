import React from "react";
import "./SuccessPopup.scss";

const SuccessPopup = ({ message, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-inner">
        <div className="success-icon">✓</div>
        <p className="msg-txt" style={{ color: "#000" }}>
          {message}
        </p>
        <button onClick={onClose} className="close">
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
