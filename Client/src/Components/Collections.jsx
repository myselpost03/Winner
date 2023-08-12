import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import Collection from "./Collection";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslation } from "react-i18next";
import "./Collection.scss";
import AddHeader from "./AddHeader";
import NavBar from "./NavBar";
import BottomTabs from "./BottomTabs";

const Collections = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data, refetch } = useQuery(
    ["collections"],
    () =>
      makeRequest.get("/collections?userId=" + userId).then((res) => {
        return res.data;
      }),
    {
      enabled: !isNaN(userId),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 2592000000,
      cacheTime: 2592000000,
      manual: true,
    }
  );

  useEffect(() => {
    if (!isNaN(userId)) {
      refetch();
      queryClient.invalidateQueries(["collections"]);
    }
  }, [userId, refetch, queryClient]);

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
