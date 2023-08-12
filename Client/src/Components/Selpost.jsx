import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faTimes,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { BiCommentDots, BiDownload } from "react-icons/bi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "./Selpost.scss";
import userimg from "../Icons/user.png";
import collection from "../Icons/image.png";
import secret from "../Icons/secret.png";
import lock from "../Icons/lock.png";
import { AuthContext } from "../Context/authContext";
import CommentPage from "../Pages/CommentPage/CommentPage";
import { saveAs } from "file-saver";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import Collections from "./Collections";

const Selpost = ({ selpost }) => {
  const [isOpen, setIsOpen] = useState(false);
  const colors = useMemo(
    () => ["#08D9D6", "#C3BEF0", "#30E3CA", "#FF9292"],
    []
  );
  const [randomColor, setRandomColor] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  //! Audio ref
  const audioRef = useRef(null);

  const { t } = useTranslation();

  //! Get current user
  const { currentUser } = useContext(AuthContext);

  //! Navigate
  const navigate = useNavigate();

  //! Play pause
  const handlePlayPause = () => {
    try {
      if (!audioRef.current || !audioRef.current.src) {
        return;
      }

      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }

      setIsPlaying(!isPlaying);
    } catch (err) {
      console.log("Error occured play or pause the audio", err);
    }
  };

  //! Duration
  const handleLoadedData = () => {
    setDuration(audioRef.current.duration);
  };

  //! Seekbar
  const handleSeek = (event) => {
    try {
      const seekTime = event.target.value;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    } catch (err) {
      console.log("Error occured to move with audio", err);
    }
  };

  //! Time
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  //! Update time
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  //! Fetch fires
  const { isLoading, data, refetch } = useQuery(["fires", selpost.id], () =>
    makeRequest.get("/fires?selpostId=" + selpost.id).then((res) => {
      return res.data;
    }),{
      enabled: selpost.id !== undefined || NaN,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 2592000000,
      cacheTime: 2592000000,
      manual: true,
    }
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (fired) => {
      if (fired) return makeRequest.delete("/fires?selpostId=" + selpost.id);
      return makeRequest.post("/fires", {
        selpostId: selpost.id,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fires"]);
      },
    }
  );

  //! Mutation for saving fire notification
  const mutation2 = useMutation(
    (newFireNotification) => {
      return makeRequest.post("/fireNotifications", newFireNotification);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fireNotifications"]);
      },
    }
  );

  //! On selpost fire
  const handleFire = async () => {
    try {
      mutation.mutate(data.includes(currentUser["user"].id));
      const capitalizedUsername =
        currentUser["user"].username.charAt(0).toUpperCase() +
        currentUser["user"].username.slice(1);
      const updatedNotificationCount = notificationCount + 1;
      setNotificationCount(updatedNotificationCount);
      
      refetch();
      queryClient.invalidateQueries(["fires"]);

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

        if (selpost.username !== currentUser["user"].username) {
          mutation2.mutate({
            selpostId: selpost.id,
            count: updatedNotificationCount,
            username: capitalizedUsername,
            selpostUsername: selpost.username,
            selpostUserId: selpost.userId,
            profilePic: currentUser["user"].profilePic,
            subscription: subscription,
          });
        }
      }
    } catch (err) {
      console.log("Error occured firing the selpost", err);
    }
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  //! Show secret message
  const handleShowSecret = () => {
    try {
      setIsOpen(true);
      generateRandomColor();
    } catch (err) {
      console.log("Error occured showing secret message", err);
    }
  };

  //! Generate random color
  const generateRandomColor = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const color = colors[randomIndex];
    setRandomColor(color);
  }, [colors]);

  useEffect(() => {
    generateRandomColor();
  }, [generateRandomColor]);

  //! Navigate to selpost user profile
  const profile = () => {
    navigate(`/profile/${selpost.userId}/`);
  };

  //! Navigate to selpost collection
  const collectionLink = () => {
    navigate(`/collection/${selpost.userId}`);
  };

  //! Download selpost
  const handleDownload = () => {
    try {
      const timestamp = Date.now();
      const fileName = `image_${timestamp}.jpg`;
      saveAs(selpost.img, fileName);
    } catch (err) {
      console.log("Error occured downloading selpost", err);
    }
  };

  return (
    <>
      <div>
        <div style={{ display: "none" }}>
          <Collections selpostUserId={selpost.userId} />
        </div>
        <div className="selpost-container">
          <div className="selpost-header">
            <div className="header-first-part">
              <img
                src={!selpost.profilePic ? userimg : selpost.profilePic}
                alt="profile"
                onClick={profile}
                id="mobile-profile-pic"
              />
              <strong className="username">
                {!selpost.category ? t("Selpost.none") : selpost.category}
              </strong>
            </div>
            <div className="icons">
              <img
                src={collection}
                alt="collection"
                className="selposts"
                onClick={collectionLink}
              />

              <img
                src={secret}
                alt="secret message"
                onClick={
                  selpost.receiver === currentUser["user"].username
                    ? handleShowSecret
                    : null
                }
                className={
                  selpost.receiver === currentUser["user"].username
                    ? "secret"
                    : "no-secret"
                }
              />
              <img
                src={lock}
                alt="lock"
                className={
                  selpost.receiver === currentUser["user"].username ? "no-lock" : "lock"
                }
              />
            </div>
          </div>
          <div className="selpost-image">
            <img src={selpost.img} alt="selpost" />
          </div>
          {isOpen && (
            <div className="popup-overlay">
              <div
                className="popup-content"
                style={{ backgroundColor: randomColor }}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  onClick={togglePopup}
                  className="close-icon"
                />
                <h2 className="msg-heading">{t("Selpost.secretMsg")}</h2>
                <p>
                  {selpost.receiver === currentUser["user"].username
                    ? selpost.secretMsg
                    : ""}
                </p>
              </div>
            </div>
          )}
          <div className="audio-message">
            <audio
              ref={audioRef}
              src={selpost.audioMsg}
              controls={false}
              autoPlay={isPlaying}
              onTimeUpdate={handleTimeUpdate}
              onLoadedData={handleLoadedData}
              style={{ width: "100%" }}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              {audioRef.current && audioRef.current.src ? (
                <FontAwesomeIcon
                  icon={isPlaying ? faPause : faPlay}
                  className="play-btn"
                  onClick={handlePlayPause}
                />
              ) : (
                <FontAwesomeIcon icon={faPlay} className="play-btn-disabled" />
              )}

              <div style={{ flex: "1", display: "flex", alignItems: "center" }}>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.01}
                  value={currentTime}
                  onChange={handleSeek}
                  style={{
                    marginRight: "0.5rem",
                    height: "8px",
                    width: "100%",
                  }}
                  className="seekbar"
                />

                <span style={{ paddingRight: "2%" }} className="duration">
                  {formatTime(duration)}
                </span>
              </div>
            </div>{" "}
          </div>
          <div className="others">
            <div className="fire-and-water">
              <div className="fire-icon-container">
                {isLoading ? (
                  t("Loading.loading")
                ) : data.includes(currentUser["user"].id) ? (
                  <FontAwesomeIcon
                    icon={faFire}
                    className="fired-icon"
                    onClick={handleFire}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faFire}
                    className="fire-icon"
                    onClick={handleFire}
                  />
                )}

                <strong>
                  {data?.length} {t("Selpost.fires")}
                </strong>
              </div>
            </div>
            <div className="dollar-and-comment">
              <Link to={`/comment/${selpost.id}`}>
                <BiCommentDots className="comment-icon" />
              </Link>

              <BiDownload
                className="dollar-icon"
                onClick={() => {
                  ReactGA.event({
                    category: "Icon",
                    action: "Click",
                    label: "Download  Icon",
                  });
                  handleDownload();
                }}
              />
            </div>
          </div>
          <div className="hide" style={{ display: "none" }}>
            <CommentPage selpostId={selpost.id} />
          </div>
        </div>




        <div className="selpost-container-desktop">
          <div className="selpost-header-desktop">
            <Link to={`/profile/${selpost.userId}/`}>
              <LazyLoadImage
                src={!selpost.profilePic ? userimg : selpost.profilePic}
                alt="profile"
              />
            </Link>
            <strong className="category">
              {!selpost.category ? "None" : selpost.category}
            </strong>
            <div className="icons">
              <Link onClick={collectionLink}>
                <img src={collection} alt="collection" />
              </Link>
              <img
                src={secret}
                alt="secret message"
                onClick={
                  selpost.receiver === currentUser["user"].username
                    ? handleShowSecret
                    : null
                }
                className={
                  selpost.receiver === currentUser["user"].username
                    ? "secret"
                    : "no-secret"
                }
              />
              <img
                src={lock}
                alt="lock"
                className={
                  selpost.receiver === currentUser["user"].username ? "no-lock" : "lock"
                }
              />
            </div>
            {isOpen && (
              <div className="popup-overlay">
                <div
                  className="popup-content"
                  style={{ backgroundColor: randomColor }}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    onClick={togglePopup}
                    className="close-icon"
                  />
                  <h2 className="msg-heading">Secret Message</h2>
                  <p>
                    {selpost.receiver === currentUser["user"].username
                      ? selpost.secretMsg
                      : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="selpost-image-desktop">
            <LazyLoadImage src={selpost.img} alt="selpost" />
          </div>
          <div className="audio-msg">
            <audio
              ref={audioRef}
              src={selpost.audioMsg ? selpost.audioMsg : null}
              controls={false}
              autoPlay={isPlaying}
              onTimeUpdate={handleTimeUpdate}
              onLoadedData={handleLoadedData}
              style={{ width: "100%", border: "none", outline: "none" }}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              {audioRef.current && audioRef.current.src ? (
                <FontAwesomeIcon
                  icon={isPlaying ? faPause : faPlay}
                  className="play-btn"
                  onClick={handlePlayPause}
                />
              ) : (
                <FontAwesomeIcon icon={faPlay} className="play-btn-disabled" />
              )}

              <div style={{ flex: "1", display: "flex", alignItems: "center" }}>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.01}
                  value={currentTime}
                  onChange={handleSeek}
                  style={{
                    marginRight: "0.5rem",
                    backgroundColor: "#eee",
                    height: "8px",
                    width: "100%",
                    border: "none",
                    outline: "none",
                  }} // Use seekbarColor variable
                />

                <span style={{ paddingRight: "2%" }} className="duration">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="others-desktop">
          {isLoading ? (
            "loading..."
          ) : data.includes(currentUser["user"].id) ? (
            <FontAwesomeIcon
              icon={faFire}
              className="fired-icon"
              onClick={handleFire}
            />
          ) : (
            <FontAwesomeIcon
              icon={faFire}
              className="fire-icon"
              onClick={handleFire}
            />
          )}
          <strong>{data?.length} Fires</strong>
          <div className="comment-and-dollar">
            <Link to={`/comment/${selpost.id}`}>
              <BiCommentDots className="comment-icon" />
            </Link>
            <BiDownload className="dollar-icon" onClick={handleDownload} />
          </div>
        </div>
        <div className="hide" style={{ display: "none" }}>
          <CommentPage selpostId={selpost.id} />
        </div>
      </div>
    </>
  );
};

export default Selpost;
