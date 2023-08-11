import React from "react";
import chrome from "../Images/chrome.png";
import ReactGA from "react-ga";
import {useTranslation} from "react-i18next"
import "./BrowserPopup.scss";

const BrowserPopup = ({ onUpdate }) => {

  const { t } = useTranslation();

  return (
    <div className="coin-popup">
      <div className="coin-popup-content">
        <div className="coin-popup-header">
          <img src={chrome} alt="chrome" />
          <h2>{t("BrowserPopup.heading")}</h2>
        </div>
        <div className="coin-popup-body">
          <p>{t("BrowserPopup.firstMessage")}</p>
          <p>{t("BrowserPopup.secondMessage")}</p>
        </div>
        <div className="coin-popup-footer">
          <button
            className="close-button"
            onClick={() => {
              ReactGA.event({
                category: "Button",
                action: "Click",
                label: "Update Browser Button",
              });
              onUpdate();
            }}
          >
            {t("BrowserPopup.update")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrowserPopup;
