import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Chats from "../../Components/Chats";
import AddHeader from "../../Components/AddHeader";
import BottomTabs from "../../Components/BottomTabs";
import NavBar from "../../Components/NavBar";
import { makeRequest } from "../../axios";
import "./InboxPage.scss";

const InboxPage = () => {
  const navigate = useNavigate();

  //! React query for status
  const queryClient = useQueryClient();

  const mutation4 = useMutation(
    (newStatus) => {
      return makeRequest.put(`/userlist/users/status`, newStatus);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["status"]);
      },
    }
  );

  const saveStatus = async () => {
    try {
      await mutation4.mutate({
        status: "offline",
      });
    } catch (err) {
      console.log("Error occured saving user status in inbox page", err);
    }
  };

  const handleBack = () => {
    navigate("/home");
  };

  const handleTwoClicks = async () => {
    try {
      await saveStatus();
      handleBack();
    } catch (err) {
      console.log("Error occured saving status and back naviagation", err);
    }
  };

  return (
    <div className="inbox-page">
      <div className="mobile-inbox">
        <AddHeader title="Inbox" onBack={handleTwoClicks} />
        <div className="chats">
          <Chats />
        </div>

        <BottomTabs />
      </div>
      <div className="navbar">
        <NavBar />
      </div>
      <div className="desktop-inbox">
        <div className="chats">
          <Chats />
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
