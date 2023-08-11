import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { makeRequest } from "../../axios";
import AddHeader from "../../Components/AddHeader";
import { AuthContext } from "../../Context/authContext";
import ReactGA from "react-ga";
import "./DeletePage.scss";

const DeletePage = () => {
  const [text, setText] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(true);

  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);

  const { t } = useTranslation();

  const queryClient = useQueryClient();


  //! Request to delete account
  const mutation = useMutation(
    (deleteAccount) => {
      return makeRequest.delete(
        `/users/delete-account?username=${currentUser["user"].username}`,
        deleteAccount
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["delete"]);
      },
    }
  );


  //! Delete account
  const deleteAccount = (e) => {
    if (e) {
      e.preventDefault();
    }

    try {
      mutation.mutate();
      toast.success(t("DeleteAccount.toast"), {
        position: toast.POSITION.TOP_RIGHT,
      });
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.log("Error occured deleting your account", err);
    }
  };

  //! Enable button on matching username
  const handleTextChange = (e) => {
    const enteredText = e.target.value;
    setText(enteredText);
    setButtonDisabled(enteredText !== currentUser["user"].username);
  };


  //! Go back
  const handleBack = () => {
    navigate("/settings");
  };

  return (
    <div className="delete-page">
      <div className="mobile-delete-page">
        <AddHeader title={t("DeleteAccount.header")} onBack={handleBack} />
        <h1 className="confirm-delete">{t("DeleteAccount.confirmText")}</h1>
        <p className="delete-text">{t("DeleteAccount.deleteText")}</p>
        <strong className="confirm-delete-text">
          {t("DeleteAccount.confirmFirstText")} {currentUser["user"].username}{" "}
          {t("DeleteAccount.confirmLastText")}:
        </strong>
        <input
          type="text"
          className="input-box"
          value={text}
          onChange={handleTextChange}
        />
        <div className="buttons">
          <button
            className={`delete-btn ${
              isButtonDisabled ? "disabled" : "enabled"
            }`}
            onClick={() => {
              ReactGA.event({
                category: "Button",
                action: "Click",
                label: "Delete Account Button",
              });
              deleteAccount();
            }}
            disabled={isButtonDisabled}
          >
            {t("DeleteAccount.confirmBtn")}
          </button>
          <button className="cancel-btn" onClick={handleBack}>
            {t("DeleteAccount.cancel")}
          </button>
        </div>
        <ToastContainer />
      </div>
      <div className="desktop-delete-page"></div>
    </div>
  );
};

export default DeletePage;
