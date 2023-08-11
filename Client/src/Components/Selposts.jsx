import React from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import Selpost from "./Selpost";
import LoadingSpinner from "./LoadingSpinner";
import selpost from "../Illustrations/photo.png";
import { useTranslation } from "react-i18next";
import "./Selposts.scss";

const Selposts = ({ userId }) => {
  const { t } = useTranslation();

  const { isLoading, error, data } = useQuery(["selposts"], () =>
    makeRequest.get("/selposts?userId=" + userId).then((res) => {
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

  return (
    <div className="selposts">
      {data.length === 0 ? (
        <img src={selpost} alt="Upload selpost" className="upload" />
      ) : (
        data.map((selpost) => <Selpost selpost={selpost} key={selpost.id} />)
      )}
    </div>
  );
};

export default Selposts;
