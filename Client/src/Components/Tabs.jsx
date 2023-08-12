import React, { useContext } from "react";
import ReactGA from 'react-ga';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faEnvelope,
  faPlus,
  faBell,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import "./Tabs.scss";
import { AuthContext } from "../Context/authContext";

const Tabs = () => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

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
      return makeRequest.put(`/userlist/users/update-subscription`, newSubscription);
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

   //! Handle 
   const handle = async  () => {
    mutation.mutate({
      status: "offline",
    })

    mutation4.mutate({
      userInChat: "out"
    })

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
      //console.log(error)
    }

    ReactGA.event({
      category: 'Tab',
      action: 'Click',
      label: 'Desktop Home Tab'
    });
  }

  //! Handle click
  const handleClick = async () => {
    mutation.mutate({
      status: "online",
    })

    mutation4.mutate({
      userInChat: "out"
    })

    ReactGA.event({
      category: 'Tab',
      action: 'Click',
      label: 'Desktop Inbox Tab'
    });

    queryClient.invalidateQueries("userlist");
    try{
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
          subscription: subscription
        });
      }
    } catch(error){
      //console.log(error)
    }
  }

  //! Handle click2
  const handleClick2 =  () => {
    mutation.mutate({
      status: "offline",
    })

    mutation4.mutate({
      userInChat: "out"
    })

     ReactGA.event({
      category: 'Tab',
      action: 'Click',
      label: 'Desktop Add Tab'
    });
  }
  //! Handle click3
  const handleClick3 =  () => {
    mutation.mutate({
      status: "offline",
    })

    mutation4.mutate({
      userInChat: "out"
    })

    ReactGA.event({
      category: 'Tab',
      action: 'Click',
      label: 'Desktop Notification Tab'
    });
  }
  //! Handle click4
  const handleClick4 = () => {
    mutation.mutate({
      status: "offline",
    })

   mutation4.mutate({
     userInChat: "out"
   })

    ReactGA.event({
      category: 'Tab',
      action: 'Click',
      label: 'Desktop Profile Tab'
    });
  }

  //! Tabs
  const tabs = [
    {
      icon: faHouse,
      path: "/home",
      onClick: handle
    },
    {
      icon: faEnvelope,
      path: "/inbox",
      onClick: handleClick
    },
    {
      icon: faPlus,
      path: "/add",
      onClick: handleClick2
    },
   
    {
      icon: faBell,
      path: "/notification",
      onClick: handleClick3
    },
    {
      icon: faUser,
      path: `/profile/${currentUser["user"].id}`,
      onClick: handleClick4
    },
  ];

  return (
    <div className="tabs">
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

export default Tabs;
