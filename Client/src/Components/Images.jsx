import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { makeRequest } from "../axios";
import Image from "./Image";
import LoadingSpinner from "./LoadingSpinner";
import collection from "../Illustrations/images.png";
import "./Images.scss";

const Images = ({ userId }) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const { isLoading, error, data, refetch } = useQuery(
    ["selposts"],
    () => {
      if (userId !== undefined) {
        return makeRequest.get("/selposts?userId=" + userId).then((res) => {
          return res.data;
        });
      }
      return Promise.resolve([]);
    },
    {
      enabled: userId !== undefined,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 2592000000,
      cacheTime: 2592000000,
      manual: true,
    }
  );

  useEffect(() => {
    if (userId !== undefined) {
      refetch();
      queryClient.invalidateQueries(["selposts"]);
    }
  }, [userId, refetch]);

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
