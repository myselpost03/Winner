import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import BottomTabs from "./BottomTabs";
import search from "../Illustrations/selfie.png";
import { makeRequest } from "../axios";
import { useTranslation } from "react-i18next";
import "./SearchBar.scss";

const SearchBar = ({ userId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [usernames, setUsernames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const { t } = useTranslation();

  const navigate = useNavigate();

  //! Handle input chnage
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query === "") {
      setSuggestions([""]);
    } else {
      getSuggestions(query);
    }
  };

  //! Search usernames
  const searchUsernames = async () => {
    try {
      const response = await makeRequest.post("/usernames", {
        searchQuery: searchQuery,
      });
      const data = response.data;
      setUsernames(data.usernames);
    } catch (error) {
      console.error("Error searching usernames:", error);
    }
  };

  //! Get search suggestions
  const getSuggestions = async (query) => {
    try {
      const response = await makeRequest.post("/usernames/suggestions", {
        searchQuery: query,
      });
      const data = response.data;
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error getting suggestions:", error);
    }
  };

  //! Hide suggestions
  const hideSuggestions = () => {
    setSuggestions([""]);
  };

  //! Route to user profile
  const userProfile = (suggestion) => {
    try {
      const extractedNumber = parseInt(
        suggestion.toString().match(/\d+$/)?.[0]
      );
      navigate(`/profile/${extractedNumber}/`);
    } catch (err) {
      console.log("Error occured navigating to user profile", err);
    }
  };

  return (
    <div className="search-functionality">
      <div className="mobile-search">
        <div className="search" onClick={hideSuggestions}>
          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder={t("Search.placeholder")}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              onClick={searchUsernames}
              className="search-icon"
            />
          </div>
          <ul className={searchQuery === "" ? "no-suggestion" : "suggestions"}>
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                className={searchQuery === "" ? "suggestion-item" : "no-item"}
                style={{ marginBottom: "18px" }}
                onClick={() => userProfile(suggestion)}
              >
                {suggestion
                  .toString()
                  .replace(/[^a-zA-Z]/g, "")
                  .trim()}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={search}
          alt="Vector lady with magnifying glass"
          className="search-illustration"
        />
        <BottomTabs />
      </div>

      <div className="desktop-search">
        <div className="search" onClick={hideSuggestions}>
          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search MySelpost..."
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              onClick={searchUsernames}
              className="search-icon"
            />
          </div>

          <ul className={searchQuery === "" ? "no-suggestion" : "suggestions"}>
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="suggestion-item"
                onClick={() => userProfile(suggestion)}
              >
                {suggestion
                  .toString()
                  .replace(/[^a-zA-Z]/g, "")
                  .trim()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
