import React from "react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment/moment";
import { makeRequest } from "../axios";
import arrow from "../Icons/trending.png";
import "./TrendingBar.scss";

const TrendingBar = () => {
  const { isLoading, error, data } = useQuery(
    ["trendings"],
    () =>
      makeRequest.get("/trendings").then((res) => {
        return res.data;
      }),
    {
      staleTime: 8000,
      refetchInterval: 3600000,
    }
  );

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="trending-bar">
      <div className="first">
        <h1>Trending Categories</h1>
        {error
          ? "Something went wrong"
          : isLoading
          ? "loading"
          : data.map((trending) => (
              <div key={trending.id} className="trendings">
                <img src={arrow} alt="trending" className="arrow" />
                <strong className="trending-categories">
                  {trending.category}
                </strong>
              </div>
            ))}
      </div>
      <div className="second">
        <h3>Selfie Of The Day</h3>
        {sIsError
          ? "Something went wrong"
          : sIsLoading
          ? "Loading"
          : sIsData &&
            sIsData.length > 0 && (
              <div className="sod">
                <img src={sIsData[0].img} alt="Selfie of the Day" />
              </div>
            )}
      </div>
    </div>
  );
};

export default TrendingBar;
