import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { AuthContext } from "../Context/authContext";
import unknown from "../Icons/user.png";
import "./Chat.scss";

const Chat = ({ u }) => {
  const [receiver, setReceiver] = useState("");
  const [sender, setSender] = useState("");
  const [count, setCount] = useState();
  const [subscription, setSubscription] = useState();

  //! Get current user
  const { currentUser } = useContext(AuthContext);

  //! React query to fetch notifications
  const { isLoading, error, data } = useQuery(
    ["notifications", u.username],
    () =>
      makeRequest
        .get(
          `/notifications?sender=${currentUser["user"].username}&receiver=${u.username}`
        )
        .then((res) => res.data),
    {
      refetchOnMount: true
    }
  );

  //! Get sender, receiver and count data
  useEffect(() => {
    try {
      if (!isLoading && !error) {
        const receiverData = data.find(
          (receiver) => receiver.sender === u.username
        );
        if (receiverData) {
          const { receiver, sender, count, subscription } = receiverData;
          setReceiver(receiver);
          setSender(sender);
          setCount(count);
          setSubscription(subscription);
        }
      }
    } catch (err) {
      console.log(
        "Error occured getting sender and receiver data in chat",
        err
      );
    }
  }, [data, isLoading, error, u.username]);

  //! React query to post notification count
  const queryClient = useQueryClient();
  const mutation3 = useMutation(
    (newCount) => {
      return makeRequest.post(
        `/notifications/?sender=${sender}&receiver=${receiver}`,
        newCount
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications", receiver]);
      },
    }
  );

  //! Mutation for user in chat
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

  //! Reset notification count to zero and update user in chat
  const handleUserClick = () => {
    try {
      mutation4.mutate({
        userInChat: "in",
      });

      mutation3.mutate({
        sender: sender,
        receiver: receiver,
        count: 0,
        userId: currentUser["user"].id,
      });
    } catch (err) {
      console.log("Error occured clicking on chat user of list", err);
    }
  };

  return (
    <div
      className={`chat-page ${
        u.username === currentUser["user"].username ? "current-user" : ""
      }`}
    >
      <div className="mobile-chat">
        <div className="first-section">
          {u.username !== currentUser["user"].username && (
            <div className="chat-container">
              <img src={u.profilePic ? u.profilePic : unknown} alt="profile pic" />
            </div>
          )}

          {u.username !== currentUser["user"].username && (
            <Link
              to={`/inbox/chat/${u.username}`}
              style={{ textDecoration: "none" }}
              onClick={handleUserClick}
            >
              <ul>{u.username}</ul>
              <div
                className={u.status === "online" ? "green-dot" : "grey-dot"}
              ></div>
            </Link>
          )}
        </div>
        {isLoading
          ? "Loading..."
          : data.map((receiver) =>
              u.username === receiver.sender &&
              receiver.receiver === currentUser["user"].username ? (
                <strong
                  className={receiver.count === 0 ? null : "notification"}
                  key={receiver.id}
                >
                  {receiver.count === 0 ? null : ""}
                </strong>
              ) : null
            )}
      </div>

      <div className="desktop-chat">
        <div className="box">
          <div className="first-section">
            {u.username !== currentUser["user"].username && (
              <div className="chat-container">
                <img src={u.profilePic ? u.profilePic : unknown} alt="profile pic" />
              </div>
            )}
            {u.username !== currentUser["user"].username && (
              <Link
                to={`/inbox/chat/${u.username}`}
                style={{ textDecoration: "none" }}
                onClick={handleUserClick}
              >
                <ul>{u.username}</ul>
                <div
                  className={u.status === "online" ? "green-dot" : "grey-dot"}
                ></div>
              </Link>
            )}
          </div>

          {isLoading
            ? "Loading..."
            : data.map((receiver) =>
                u.username === receiver.sender ? (
                  <strong
                    className={receiver.count === 0 ? null : "notification"}
                    key={receiver.id}
                  >
                    {receiver.count === 0 ? null : ""}
                  </strong>
                ) : null
              )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
