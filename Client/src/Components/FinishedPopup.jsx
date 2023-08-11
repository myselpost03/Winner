import React from "react";
import piggy from "../Images/piggy.png";
import "./FinishedPopup.scss";

const FinishedPopup = ({ onClose }) => {
  return (
    <div className="piggy-popup">
      <div className="piggy-popup-content">
        <div className="piggy-popup-header">
          <img src={piggy} alt="piggy bank" />
          <h2 className="popup-text">Not Enough Coins!</h2>
        </div>
        <div className="piggy-popup-body">
          <p>You can earn 10 coins by inviting</p>
          <p>people. Just click on above share icon.</p>
        </div>
        <div className="piggy-popup-footer">
          <button className="piggy-close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default FinishedPopup;
