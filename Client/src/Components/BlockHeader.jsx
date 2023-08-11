import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./BlockHeader.scss";

const BlockHeader = ({ title, onBack, onBlock }) => {
  const { t } = useTranslation();
  return (
    <div className="block-header">
      <div className="block-back-arrow" onClick={onBack}>
        <FaArrowLeft />
      </div>
      <h1 className="block-title">{title}</h1>
      <button className="block-button" onClick={onBlock}>
        {t("BlockHeader.block")}
      </button>
    </div>
  );
};

export default BlockHeader;
