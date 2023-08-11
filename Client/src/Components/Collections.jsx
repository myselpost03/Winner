import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import Collection from "./Collection";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslation } from "react-i18next";
import "./Collection.scss";
import AddHeader from "./AddHeader";
import NavBar from "./NavBar";
import BottomTabs from "./BottomTabs";

const Collections = ({ selpostUserId }) => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(
    [],
    () =>
      makeRequest.get("/collections?userId=" + userId).then((res) => {
        return res.data;
      })
   
  );

  if (error) {
    return <div className="selposts">{t("Error.error")}</div>;
  }

  if (isLoading) {
    return (
      <div className="selposts">
        <LoadingSpinner />
      </div>
    );
  }

  const handleBack = () => {
    navigate("/home");
  };

  return (
    <>
      <NavBar className="navbar" />
      <AddHeader
        title={t("Collection.title")}
        onBack={handleBack}
        className="header"
      />
      <div className="bottom">
      <BottomTabs />
      </div>
      <div className="sel">
        {data.map((image) => (
          <Collection collection={image} key={image.id} />
        ))}
      </div>
    </>
  );
};

export default Collections;
