import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import { makeRequest } from "../axios";
import BottomTabs from "./BottomTabs";
import AddHeader from "./AddHeader";
import "./sod.scss";

const SOD = () => {
  const navigate = useNavigate();

  const { width, height } = useWindowSize();

  const {t} = useTranslation();

  const fetchData = async () => {
    try {
      const timestamp24HoursAgo = moment()
        .subtract(24, "hours")
        .format("YYYY-MM-DD HH:mm:ss");

      const response = await makeRequest.get(
        `/sod?timestamp=${timestamp24HoursAgo}`
      );
      return response.data;
    } catch (err) {
      console.log("Error occured fetching the selfie of the day", err);
    }
  };

  const {
    isLoading: sIsLoading,
    error: sIsError,
    data: sIsData,
  } = useQuery(["selfieOfDay"], fetchData, {
    staleTime: 8000,
    refetchInterval: 24 * 60 * 60 * 1000,
  });

  if (sIsLoading) {
    return <div>Loading...</div>;
  }

  if (sIsError) {
    return <div>Error: {sIsError.message}</div>;
  }

  const handleBack = () => {
    navigate("/home");
  };

  return (
    <div>
      <AddHeader title={t("Sod.sod")} onBack={handleBack} />
      <BottomTabs />
      <div className="photo">
        <Confetti width={width} height={height} />
        {sIsError
          ? "Something went wrong"
          : sIsLoading
          ? "Loading"
          : sIsData &&
            sIsData.length > 0 && (
              <div className="sod-container">
                <img
                  src={sIsData[0].img}
                  alt="Selfie of the Day"
                  className="sod-img"
                />
                <h3 className="congrats">{t("Sod.congrats")}</h3>
              </div>
            )}
      </div>
    </div>
  );
};

export default SOD;
