import React from "react";
import bulb from "../Images/bulb.png";
import { useTranslation } from "react-i18next";
import "./HintsPopup.scss";

const HintsPopup = ({ message, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="hints-popup">
      <div className="hints-popup-content">
        <div className="hints-popup-header">
          <img src={bulb} alt="trophy" />
        </div>
        <div className="hints-popup-body">
          <p>{message}</p>
        </div>
        <div className="hints-popup-footer">
          <button className="hints-close-button" onClick={onClose}>
            {t("HintPopup.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HintsPopup;
