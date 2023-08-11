import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import { makeRequest } from "../../axios";
import AddHeader from "../../Components/AddHeader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../Context/authContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BottomTabs from "../../Components/BottomTabs";
import "./FeedbackPage.scss";

const FeedbackPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newFeedback) => {
      return makeRequest.post("/feedbacks", newFeedback);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["feedbacks"]);
      },
    }
  );

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      mutation.mutate({ name: name, email: email, message: message });
      setName("");
      setEmail("");
      setMessage("");
      toast.success(t("Feedback.toast"), {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      console.log("Error occured submitting your feedback", err);
    }
  };

  const handleBack = () => {
    navigate(`/profile/${currentUser["user"].id}`);
  };

  return (
    <div>
      <div className="desktop-feedback-page">
        <NavBar />
        <form className="feedback-form" onSubmit={handleSubmit}>
          <h2>{t("Feedback.feedback")}</h2>
          <input
            type="text"
            placeholder={t("Feedback.namePlaceholder")}
            value={name}
            onChange={handleNameChange}
            required
          />
          <input
            type="email"
            placeholder={t("Feedback.emailPlaceholder")}
            value={email}
            onChange={handleEmailChange}
            required
          />
          <textarea
            placeholder={t("Feedback.message")}
            value={message}
            onChange={handleMessageChange}
            required
          ></textarea>
          <button
            type="submit"
            disabled={!name || !email || !message ? true : false}
            className={
              !name || !email || !message ? "disabled-btn" : "enabled-btn"
            }
          >
            {t("Feedback.submit")}
          </button>
        </form>
        <ToastContainer />
      </div>
      <div className="mobile-feedback-page">
        <AddHeader title={t("Feedback.header")} onBack={handleBack} />
        <BottomTabs />
        <form className="feedback-form" onSubmit={handleSubmit}>
          <h2>{t("Feedback.feedback")}</h2>
          <input
            type="text"
            placeholder={t("Feedback.namePlaceholder")}
            value={name}
            onChange={handleNameChange}
            required
          />
          <input
            type="email"
            placeholder={t("Feedback.emailPlaceholder")}
            value={email}
            onChange={handleEmailChange}
            required
          />
          <textarea
            placeholder={t("Feedback.message")}
            value={message}
            onChange={handleMessageChange}
            required
          ></textarea>
          <button
            type="submit"
            disabled={!name || !email || !message ? true : false}
            className={
              !name || !email || !message ? "disabled-btn" : "enabled-btn"
            }
          >
            {t("Feedback.submit")}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default FeedbackPage;
