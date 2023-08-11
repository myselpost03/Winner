import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { makeRequest } from "../axios";
import LoadingSpinner from "./LoadingSpinner";
import AddHeader from "./AddHeader";
import GuessCard from "./GuessCard";

const GuessCards = ({ userId }) => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  //! Handle back
  const HandleBack = () => {
    navigate("/home");
  };

  //! Fetch guess images
  const { isLoading, error, data } = useQuery(["guesses"], () =>
    makeRequest.get("/guesses?userId=" + userId).then((res) => {
      return res.data;
    })
  );

  //! Error
  if (error) {
    return <div className="guesses">{t("Error.error")}</div>;
  }

  //! Loading
  if (isLoading) {
    return (
      <div className="guesses">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="guess">
      <AddHeader title={t("GuessCards.title")} onBack={HandleBack} />
      <GuessCard cards={data} />
    </div>
  );
};

export default GuessCards;
