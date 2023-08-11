import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { makeRequest } from "../axios";
import Image from "./Image";
import LoadingSpinner from "./LoadingSpinner";
import collection from "../Illustrations/images.png";
import "./Images.scss";

const Images = ({ userId }) => {
  const { t } = useTranslation();

  const { isLoading, error, data } = useQuery(
    ["selposts"],
    () =>
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

  if (data.length === 0) {
    return (
      <div className="no-collection">
        <img src={collection} alt="collection" className="no-collection-img" />
      </div>
    );
  }

  return (
    <div className="image-sel">
      {data.map((image) => (
        <Image image={image} key={image.id} />
      ))}
    </div>
  );
};

export default Images;
