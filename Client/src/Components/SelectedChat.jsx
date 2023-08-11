import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../Context/authContext";
import BlockHeader from "./BlockHeader";
import NavBar from "./NavBar";
import { makeRequest } from "../axios";
import ReactGA from "react-ga";
import chat from "../Illustrations/chat.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SelectedChat.scss";

const SelectedChat = () => {
  const [msg, setMsg] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [notificationCount, setNotificationCount] = useState(1);

  //! Ref
  const mobileChatSectionRef = useRef(null);
  const desktopChatSectionRef = useRef(null);

  //! Get receiver username
  const { username } = useParams();

  const { t } = useTranslation();

  //! Get current user
  const { currentUser } = useContext(AuthContext);

  //! Get chats from database
  const { isLoading, error, data } = useQuery(
    ["chats"],
    () =>
      makeRequest
        .get(
          `/chats?sender=${currentUser["user"].username}&receiver=${username}`
        )
        .then((res) => {
          return res.data;
        }),
    {
      refetchOnMount: true,
    }
  );

  //! Get blocked users
  const { data: blockedUsernames } = useQuery(
    ["blockedUsernames"],
    () =>
      makeRequest
        .get(`/chats/block?blockedUsername=${username}`)

        .then((res) => {
          //console.log(data[0].receiver);
          return res.data;
        }),
    {
      refetchOnMount: true,
    }
  );

  //! Post chats to database
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (newChat) => {
      return makeRequest.post("/chats", newChat);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["chats"]);
      },
    }
  );

  //! Received message
  useEffect(() => {
    try {
      if (username !== currentUser["user"].username) {
        setNotificationCount((prevCount) => prevCount + 1);
      }
    } catch (err) {
      console.log("Error occured receiving message in selected chat", err);
    }
  }, [currentUser["user"].username]);

  //! Mutation for notification
  const mutation2 = useMutation(
    (newNotification) => {
      return makeRequest.post(
        `/notifications?sender=${currentUser["user"].username}&receiver=${username}`,
        newNotification
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications", username]);
      },
    }
  );

  //! Mutation for block chats
  const mutation3 = useMutation((newBlock) => {
    return makeRequest.put("/chats/block", newBlock);
  });

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

  //! Input change
  const handleInputChange = (event) => {
    const inputText = event.target.value;
    const filteredText = filterProfanity(inputText);
    setMsg(filteredText);
  };

  //! Profanity filter
  const filterProfanity = (inputText) => {
    const profanityList = [
      "asshole",
      "fuck",
      "stupid",
      "idiot",
      "penis",
      "sex",
      "prostitute",
      "porn",
      "pornstar",
      "gay",
      "ass",
      "dick",
      "boobs",
      "kill",
      "poo",
      "pee",
    ];
    let filteredText = inputText;

    profanityList.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      filteredText = filteredText.replace(regex, "*".repeat(word.length));
    });

    return filteredText;
  };

  //! Onback navigation
  const navigate = useNavigate();

  const handleBack = () => {
    try {
      mutation4.mutate({
        userInChat: "out",
      });
      navigate("/inbox");
    } catch (err) {
      console.log("Error occured to set userinchat as out", err);
    }
  };

  //! Scroll to bottom
  const scrollToBottom = () => {
    if (mobileChatSectionRef.current) {
      mobileChatSectionRef.current.scrollTop =
        mobileChatSectionRef.current.scrollHeight;
    }
    if (desktopChatSectionRef.current) {
      desktopChatSectionRef.current.scrollTop =
        desktopChatSectionRef.current.scrollHeight;
    }
  };

  //! Block user
  const blockUser = () => {
    try {
      const newBlocked = !blocked;
      setBlocked(newBlocked);
      toast.success(t("BlockPopup.block"), {
        position: toast.POSITION.TOP_RIGHT,
      });

      mutation3.mutate(
        {
          blocked: newBlocked ? "true" : "false",
          blockedBy: currentUser["user"].username,
          blockedUsername: username,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["block"]);
          },
        }
      );
    } catch (err) {
      console.log("Error blocking user", err);
    }
  };

  //! Send message
  const sendMsg = async (e) => {
    if (e) {
      e.preventdefault();
    }

    try {
      const messageData = {
        sender: currentUser["user"].username,
        receiver: username,
        message:
          blockedUsernames && blockedUsernames.length > 0
            ? "You are blocked"
            : msg,
      };

      mutation.mutate(messageData);

      if (blockedUsernames && blockedUsernames.length > 0) {
        mutation2.mutate({
          sender: currentUser["user"].username,
          receiver: username,
          count: 0,
        });
      } else {
        mutation2.mutate({
          sender: currentUser["user"].username,
          receiver: username,
          count: notificationCount,
          userId: currentUser["user"].Id,
        });
      }

      setMsg("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //! Scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [data]);

  return (
    <div className="selected-chat">
      <div className="mobile-selected-chat">
        <BlockHeader title={username} onBlock={blockUser} onBack={handleBack} />
        <div className="chat-section" ref={mobileChatSectionRef}>
          {blockedUsernames && blockedUsernames.length > 0 ? (
            <p className="blocked">{t("Chat.blocked")}</p>
          ) : error ? (
            t("Error.error")
          ) : isLoading ? (
            t("Loading.loading")
          ) : data.length === 0 ? (
            <div>
              <p className="no-msg">{t("Chat.sendMsgDemo")}</p>
              <img src={chat} alt="chat vector" className="chat-illustration" />
            </div>
          ) : (
            data.map((chat) => (
              <div
                key={chat.id}
                className={
                  chat.sender === currentUser["user"].username
                    ? "receiver-msg"
                    : "sender-msg"
                }
              >
                <p
                  className={
                    chat.sender === currentUser["user"].username
                      ? "sent-msg"
                      : "received-msg"
                  }
                >
                  {chat.message}
                </p>
              </div>
            ))
          )}

          <div
            className="scroll-to-bottom"
            onClick={scrollToBottom}
            style={{ visibility: "hidden" }}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </div>
        </div>

        {!blockedUsernames || blockedUsernames.length === 0 ? (
          <div className="fixed-input-container">
            <input
              type="text"
              placeholder={t("Chat.placeholder")}
              value={msg}
              onChange={handleInputChange}
            />
            <div className="icons">
              <FontAwesomeIcon
                icon={faPaperPlane}
                className={!msg ? "disable-send-icon" : "send-icon"}
                onClick={() => {
                  ReactGA.event({
                    category: "Icon",
                    action: "Click",
                    label: "Send Icon",
                  });
                  sendMsg();
                }}
              />
              {/* <button onClick={blockUser}>
              {blocked ? "Unblock User" : "Block User"}
            </button>*/}
            </div>
          </div>
        ) : null}
        <ToastContainer />
      </div>

      <div className="navbar">
        <NavBar />
      </div>
      <div className="desktop-selected-chat">
        <div className="chat-section" ref={desktopChatSectionRef}>
          {error ? (
            t("Error.error")
          ) : isLoading ? (
            t("Loading.loading")
          ) : data.length === 0 ? (
            <p className="no-msg">{t("Chat.sendMsgDemo")}</p>
          ) : (
            data.map((chat) => (
              <div
                key={chat.id}
                className={
                  chat.sender === currentUser["user"].username
                    ? "receiver-msg"
                    : "sender-msg"
                }
              >
                <p
                  className={
                    chat.sender === currentUser["user"].username
                      ? "desktop-sent-msg"
                      : "desktop-received-msg"
                  }
                >
                  {chat.message}
                </p>
              </div>
            ))
          )}

          <div
            className="scroll-to-bottom"
            onClick={scrollToBottom}
            style={{ visibility: "hidden" }}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </div>
        </div>
        <div className="fixed-input-container">
          <input
            type="text"
            placeholder="Type your message here..."
            value={msg}
            onChange={handleInputChange}
          />
          <div className="icons">
            <FontAwesomeIcon
              icon={faPaperPlane}
              className={!msg ? "disable-send-icon" : "send-icon"}
              onClick={sendMsg}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedChat;
