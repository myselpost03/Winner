import React, { useContext } from "react";
import ReactGA from "react-ga";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faEnvelope,
  faPlus,
  faUser,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { AuthContext } from "../Context/authContext";
import "./BottomTabs.scss";

const BottomTabs = () => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const userId = currentUser["user"].id

  //! Mutation for updating user status
  const mutation = useMutation(
    (newStatus) => {
      return makeRequest.put(`/userlist/users/status`, newStatus);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["status"]);
      },
    }
  );

  //! Mutation for inserting user subscription
  const mutation2 = useMutation(
    (newSubscription) => {
      return makeRequest.put(
        `/userlist/users/update-subscription`,
        newSubscription
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["subscription"]);
      },
    }
  );

  //! Mutation for updating user in chat
  const mutation4 = useMutation(
    (newInChat) => {
      return makeRequest.put("/userlist/users/user-in-chat", newInChat);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["newInChat"]);
      },
    }
  );

  //! Handle home click
  const handleHomeClick = async () => {
    try {
      mutation.mutate({
        status: "offline",
      });

      mutation4.mutate({
        userInChat: "out",
      });

      try {
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.register(
            "/service-worker.js"
          );
          await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              "BO-XPV2fhwg7iBkqsfj8bJhEeTLbswwFTXcmwQgfjQx706RUOwxYAvYOTOOXPE_tdp1tujLO4RWa0Q181a_OhA0",
          });
          const subscription = await registration.pushManager.getSubscription();

          mutation2.mutate({
            subscription: subscription,
          });
        }
      } catch (error) {
        console.log(
          "Error occured getting user subscription on home click",
          error
        );
      }

      ReactGA.event({
        category: "Bottom Tab",
        action: "Click",
        label: "Home Tab",
      });
    } catch (err) {
      console.log("Error occured updating clicking home tab", err);
    }
  };

  //! Handle inbox click
  const handleInboxClick = async () => {
    try {
      mutation.mutate({
        status: "online",
      });

      mutation4.mutate({
        userInChat: "out",
      });

      ReactGA.event({
        category: "Bottom Tab",
        action: "Click",
        label: "Inbox Tab",
      });

      queryClient.invalidateQueries("userlist");

      try {
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.register(
            "/service-worker.js"
          );
          await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              "BO-XPV2fhwg7iBkqsfj8bJhEeTLbswwFTXcmwQgfjQx706RUOwxYAvYOTOOXPE_tdp1tujLO4RWa0Q181a_OhA0",
          });
          const subscription = await registration.pushManager.getSubscription();

          mutation2.mutate({
            subscription: subscription,
          });
        }
      } catch (error) {
        console.log(
          "Error occured getting user subscription on home click",
          error
        );
      }
    } catch (err) {
      console.log("Error occured updating clicking home tab", err);
    }
  };

  //! Handle add click
  const handleAddClick = () => {
    try {
      mutation.mutate({
        status: "offline",
      });

      mutation4.mutate({
        userInChat: "out",
      });

      ReactGA.event({
        category: "Bottom Tab",
        action: "Click",
        label: "Add Tab",
      });
    } catch (err) {
      console.log("Error occured clicking on add icon", err);
    }
  };

  //! Handle guess click
  const handleGuessClick = () => {
    try {
      mutation.mutate({
        status: "offline",
      });

      mutation4.mutate({
        userInChat: "out",
      });

      ReactGA.event({
        category: "Bottom Tab",
        action: "Click",
        label: "Guess Tab",
      });
    } catch (err) {
      console.log("Error occured clicking on guess tab", err);
    }
  };

  //! Handle profile click
  const handleProfileClick = () => {
    try {
      mutation.mutate({
        status: "offline",
      });

      mutation4.mutate({
        userInChat: "out",
      });

      ReactGA.event({
        category: "Bottom Tab",
        action: "Click",
        label: "Profile Tab",
      });


    } catch (err) {
      console.log("Error occured clicking on profile tab", err);
    }
  };

  //! Tabs
  const tabs = [
    {
      icon: faHouse,
      path: "/home",
      onClick: handleHomeClick,
    },
    {
      icon: faEnvelope,
      path: "/inbox",
      onClick: handleInboxClick,
    },
    {
      icon: faPlus,
      path: "/add",
      onClick: handleAddClick,
    },
    {
      icon: faLightbulb,
      path: "/guess",
      onClick: handleGuessClick,
    },
    {
      icon: faUser,
      path: `/profile/${userId}`,
      onClick: handleProfileClick,
    },
  ];

  return (
    <div className="bottom-tabs">
      {tabs.map((tab, index) => (
        <Link
          to={tab.path}
          key={index}
          style={{ textDecoration: "none" }}
          className={`tab ${location.pathname === tab.path ? "active" : ""}`}
          onClick={tab.onClick}
        >
          <FontAwesomeIcon icon={tab.icon} className="icons" />
        </Link>
      ))}
    </div>
  );
};

export default BottomTabs;
