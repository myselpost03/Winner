import React from "react";
import { useTranslation } from "react-i18next";
import trophy from "../Images/trophy.png";
import "./PassedPopup.scss";

const PassedPopup = ({ coinsEarned, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="coin-popup">
      <div className="coin-popup-content">
        <div className="coin-popup-header">
          <img src={trophy} alt="trophy" />
          <h2>{t("PassedPopup.congrats")}</h2>
        </div>
        <div className="coin-popup-body">
          <p>
            {t("PassedPopup.firstMsg")} {coinsEarned} {t("PassedPopup.coins")}!
          </p>
          <p>{t("PassedPopup.keep")}</p>
        </div>
        <div className="coin-popup-footer">
          <button className="close-button" onClick={onClose}>
            {t("PassedPopup.continue")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassedPopup;
