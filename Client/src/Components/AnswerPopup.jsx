import React from "react";
import { useTranslation } from "react-i18next";
import Answer from "../Images/answer.png";
import "./AnswerPopup.scss";

const AnswerPopup = ({ answer, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="answer-popup">
      <div className="answer-popup-content">
        <div className="answer-popup-header">
          <img src={Answer} alt="question mark" />
          <h2>{t("AnswerPopup.answer")}</h2>
        </div>
        <div className="answer-popup-body">
          <p>{answer}</p>
        </div>
        <div className="answer-popup-footer">
          <button className="close-button" onClick={onClose}>
            {t("AnswerPopup.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerPopup;
