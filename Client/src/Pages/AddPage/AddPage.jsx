import React from "react";
import { useNavigate } from "react-router-dom";
import "./AddPage.scss";
import NavBar from "../../Components/NavBar";
import AddHeader from "../../Components/AddHeader";
import BottomTabs from "../../Components/BottomTabs";
import FaceRecognition from "../../Components/FaceRecognition";
import { useTranslation } from "react-i18next";

const AddPage = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleBack = () => {
    navigate("/home");
  };

  return (
    <div>
      <div className="mobile-add-page">
        <AddHeader title={t("CreateSelpost.createTitle")} onBack={handleBack} />
        <BottomTabs />
      </div>
      <div className="desktop-add-page">
        <NavBar />
      </div>
      <div style={{ paddingTop: "10rem" }}>
        <FaceRecognition />
      </div>
    </div>
  );
};

export default AddPage;
