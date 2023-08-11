import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import AddHeader from "../../Components/AddHeader";
import { AuthContext } from "../../Context/authContext";
import LoadingSpinner from "../../Components/LoadingSpinner";
import NavBar from "../../Components/NavBar";
import BottomTabs from "../../Components/BottomTabs";
import { useTranslation } from "react-i18next";
import noNotificationsImage from "../../Illustrations/notification.png";
import user from "../../Icons/user.png";
import "./NotificationPage.scss";

const NotificationPage = () => {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const { t } = useTranslation();

  //! Get fire notifications
  const { isLoading, error, data } = useQuery(["fireNotifications"], () =>
    makeRequest
      .get(`/fireNotifications?selpostUsername=${currentUser["user"].username}`)
      .then((res) => res.data)
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        throw error;
      }),{
        refetchOnMount: true,
      }
  );

  //! Handle back navigation
  const handleBack = () => {
    navigate("/home");
  };

  return (
    <div className="notification-page">
      <AddHeader
        title={t("Notification.notificationTitle")}
        onBack={handleBack}
        className="header"
      />
      <NavBar className="desktop-header" />
      <div className="mobile-notification">
        <BottomTabs />
        {error ? (
          ""
        ) : isLoading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <div className="no-notification">
            <img
              src={noNotificationsImage}
              alt="Man pointing to bell"
              className="no-notification-img"
            />
          </div>
        ) : (
          data.map((fireNotification) => (
            <div className="notifications" key={fireNotification.id}>
              <div className="first-part">
                <img
                  src={
                    fireNotification.profilePic
                      ? fireNotification.profilePic
                      : user
                  }
                  alt="profile"
                  className="notification-profile"
                />
                <div className="content">
                  <h3 className="notification-username">
                    {fireNotification.username}
                  </h3>
                  <strong className="text">
                    {t("Notification.notificationText")}
                  </strong>
                </div>
              </div>
              <div className="second-part">
                <span className="date">
                  {moment(fireNotification.createdAt).fromNow()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="desktop-notification">
        {error ? (
          "Something went wrong"
        ) : isLoading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <div className="no-notification-desktop">
            <img
              src={noNotificationsImage}
              alt="Man pointing to bell"
              className="no-notification-img-desktop"
            />
          </div>
        ) : (
          data.map((fireNotification) => (
            <div className="notifications" key={fireNotification.id}>
              <div className="first-part">
                <img
                  src={
                    fireNotification.profilePic
                      ? fireNotification.profilePic
                      : user
                  }
                  alt="profile"
                  className="notification-profile"
                />
                <div className="content">
                  <h3 className="notification-username">
                    {fireNotification.username}
                  </h3>
                  <strong className="text">fired your selpost.</strong>
                </div>
              </div>
              <div className="second-part">
                <span className="date">
                  {moment(fireNotification.createdAt).fromNow()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
