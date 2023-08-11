import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileContract,
  faLock,
  faCircleInfo,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import AddHeader from "../../Components/AddHeader";
import { AuthContext } from "../../Context/authContext";
import { useTranslation } from "react-i18next";
import "./SettingsPage.scss";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { currentUser } = useContext(AuthContext);

  const handleBack = () => {
    navigate(`/profile/${currentUser["user"].id}/`);
  };

  return (
    <div>
      <AddHeader title={t("Settings.settings")} onBack={handleBack} />
      <div className="sections">
        <Link to="/terms" className="terms-link">
          <FontAwesomeIcon icon={faFileContract} className="icon" />
          <strong className="terms">{t("Settings.terms")}</strong>
        </Link>
        <Link to="/privacy" className="privacy-policy-link">
          <FontAwesomeIcon icon={faLock} className="icon" />
          <strong className="privacy-policy">{t("Settings.privacy")}</strong>
        </Link>

        <Link to="/about" className="about-link">
          <FontAwesomeIcon icon={faCircleInfo} className="icon" />
          <strong className="about">{t("Settings.about")}</strong>
        </Link>

        <Link to="/delete" className="delete-account-link">
          <FontAwesomeIcon icon={faTrash} className="icon" />
          <strong className="delete-account">
            {t("Settings.deleteAccount")}
          </strong>
        </Link>
      </div>
    </div>
  );
};

export default SettingsPage;
