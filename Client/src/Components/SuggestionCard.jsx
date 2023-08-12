import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../Context/authContext";
import { makeRequest } from "../axios";
import "./SuggestionCard.scss";

const SuggestionCard = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(
    ["suggestions"],
    () =>
      makeRequest.get("/suggestions").then((res) => {
        return res.data;
      }),
    {
      refetchOnMount: false,
      refetchInterval: 3600000, // 1 hour in milliseconds
    }
  );

  return (
    <div className="suggestion-card">
      <div className="mobile-card"></div>
      <div className="desktop-card">
        <h1>People</h1>
        {error
          ? "Something went wrong"
          : isLoading
          ? "loading"
          : data.map((suggestion) => (
              <div key={suggestion.id} className="suggestions">
                <Link
                  to={`/profile/${suggestion.id}`}
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    flexDirectiion: "row",
                  }}
                >
                  <strong
                    className="usernames"
                    style={{
                      display:
                        suggestion.username === currentUser["user"].username
                          ? "none"
                          : "block",
                    }}
                  >
                    {suggestion.username === currentUser["user"].username
                      ? null
                      : suggestion.username}
                  </strong>
                </Link>
              </div>
            ))}
      </div>
    </div>
  );
};

export default SuggestionCard;
