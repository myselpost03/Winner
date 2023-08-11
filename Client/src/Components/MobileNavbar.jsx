import React, { useContext } from "react";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { AuthContext } from "../Context/authContext";
import notification from "../Icons/bell.png";
import "./MobileNavbar.scss";

const MobileNavbar = () => {
  //! Get current user
  const { currentUser } = useContext(AuthContext);

  //! Query client
  const queryClient = useQueryClient();

  //!Get Fire notification count
  const { isLoading, error, data } = useQuery(
    ["fireNotifications"],
    () =>
      makeRequest
        .get(`/fireNotifications?selpostUsername=${currentUser["user"].username}`)
        .then((res) => {
          return res.data;
        }),{
          refetchOnMount: true,
        }
  );

  //! Mutation for reseting the count
  const mutation = useMutation(
    (newFireCount) => {
      return makeRequest.put(
        `/fireNotifications?selpostUsername=${currentUser["user"].username}`,
        newFireCount
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["newFireCount"]);
      },
    }
  );

  //! Reset count to zero
  const handleReset = () => {
    try {
      mutation.mutate({
        count: 0,
      });
    } catch (err) {
      console.log("Error occured resting the count in mobile navbar", err);
    }
  };

  return (
    <div className="mobile-navbar">
      <div className="website-title">
        <h1 data-translate="no">MySelpost</h1>
      </div>

      <div className="others">
        <Link to="/notification" className="notification">
          <img
            src={notification}
            alt="bell"
            className="bell"
            onClick={() => {
              ReactGA.event({
                category: "Icon",
                action: "Click",
                label: "Notification Icon",
              });
              handleReset();
            }}
          />
          {error
            ? null
            : isLoading
            ? ""
            : data.map((fireNotification) =>
                fireNotification.count === 0 ? null : (
                  <strong className="count">
                    {fireNotification.count > 0 ? "" : null}
                  </strong>
                )
              )}
        </Link>
        <Link
          className="search-container"
          to="/search"
          onClick={ReactGA.event({
            category: "Icon",
            action: "Click",
            label: "Search Icon",
          })}
        >
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </Link>
      </div>
    </div>
  );
};

export default MobileNavbar;
