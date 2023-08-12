import React, { useContext, useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BottomTabs from "../../Components/BottomTabs";
import LoadingSpinner from "../../Components/LoadingSpinner";
import EditProfile from "../../Components/EditProfile";
import Images from "../../Components/Images";
import cover from "../../Images/bg.jpg";
import unknown from "../../Icons/user.png";
import "./ProfilePage.scss";
import book from "../../Icons/book.png";
import location from "../../Icons/location.png";
import exit from "../../Icons/exit.png";
import gender from "../../Icons/gender.png";
import users from "../../Icons/users.png";
import settings from "../../Icons/settings.png";
import Selposts from "../../Components/Selposts";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../Context/authContext";
import { LanguageContext } from "../../Context/languageContext";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import SearchBar from "../../Components/SearchBar";
import ReactGA from "react-ga";

const ProfilePage = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const { language, changeLanguage } = useContext(LanguageContext);

  const { t } = useTranslation();

  const navigate = useNavigate();

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const queryClient = useQueryClient();

  //! Request to update app language
  const mutationForLanguage = useMutation(
    (language) => {
      return makeRequest.put("/userlist/users/update-language", language);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["language"]);
      },
    }
  );

  //! Request to get app language
  const {
    isLoading: lIsLoading,
    data: lData,
    refetch,
  } = useQuery(
    ["languages", currentUser],
    () =>
      makeRequest
        .get(
          `/userlist/users/get-user-language?username=${currentUser["user"].username}`
        )
        .then((res) => {
          return res.data;
        }),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 2592000000, 
      cacheTime: 2592000000,
      manual: true,
    }
  );

  //! Request to get supporters
  const {
    isLoading: sIsLoading,
    isError: sIsError,
    data: sIsData,
  } = useQuery(
    ["supporters"],
    () =>
      makeRequest
        .get(
          `/relationships/get-supporters?supportedUserId=${currentUser["user"].id}`
        )
        .then((res) => {
          return res.data;
        }),
    {
      refetchOnMount: true,
    }
  );

  //! Change app language
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    changeLanguage(selectedLanguage);
    queryClient.invalidateQueries(["languages"]);

    try {
      mutationForLanguage.mutate({
        language: selectedLanguage,
      });

      refetch();
    } catch (error) {
      console.log("Error occurred while saving language preference:", error);
    }
  };

  useEffect(() => {
    try {
      if (lData && lData.language) {
        i18n.changeLanguage(lData.language);
      }
    } catch (err) {
      console.log("Error occured");
    }
  }, [lData]);

  //! Logout user
  const handleLogout = useCallback(() => {
    try {
      logout();
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.log("Error occured logging out", err);
    }
  }, [logout, navigate]);

  //! Get user
  const {
    isLoading,
    error,
    data,
    refetch: userRefetch,
  } = useQuery(
    ["user"],
    () =>
      makeRequest.get("/users/find/" + userId).then((res) => {
        return res.data;
      }),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 2592000000, 
      cacheTime: 2592000000,
      manual: true,
    }
  );

  useEffect(() => {
    userRefetch();
    queryClient.invalidateQueries(["user"]);
  }, [userId, userRefetch, queryClient]);

  //! Get supported user
  const {
    isLoading: rIsLoading,
    data: relationshipData,
    refetch: supportedRefetch,
  } = useQuery(
    ["relationship"],
    () =>
      makeRequest
        .get("/relationships?supportedUserId=" + userId)
        .then((res) => {
          return res.data;
        }),
        {
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          staleTime: 2592000000, 
          cacheTime: 2592000000,
          manual: true,
        }
  );

  //! Unsupport user
  const mutation = useMutation(
    (supporting) => {
      if (supporting)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  //! Support user
  const handleSupport = () => {
    try {
      if (
        relationshipData &&
        relationshipData.includes(currentUser["user"].id)
      ) {
        mutation.mutate(true);
      } else {
        mutation.mutate(false);
      }

      supportedRefetch();
      queryClient.invalidateQueries(["relationship"]);
    } catch (err) {
      console.log("Error occured supporting user", err);
    }
  };

 

  //! Showing loading spinner
  if (isLoading || lIsLoading || sIsLoading) {
    return (
      <div className="consistent-loader">
        <div className="mobile-loader">
          <BottomTabs />
          <LoadingSpinner />
        </div>
        <div className="desktop-loader">
          <NavBar />
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  //! Show errors
  if (error || sIsError) {
    return (
      <div>
        {t("Error.error")} {error?.message || t("Error.error")}
      </div>
    );
  }

  if (!data) {
    return <div>{t("Loading.loading")}</div>;
  }

  return (
    <div className="profile-page">
      {data && (
        <>
          <div className="mobile-profile-page">
            <BottomTabs userId={userId} />
           {/* <RefreshFAB handleClick={handleInvalidate} />*/}
            <div className="profile-cover">
              {rIsLoading ? (
                "loading.."
              ) : userId === currentUser["user"].id ? (
                <div className="settings-and-logout">
                  <div
                    className="logout"
                    style={{ paddingRight: "2rem" }}
                    onClick={() => {
                      ReactGA.event({
                        category: "Button",
                        action: "Click",
                        label: "Logout Button",
                      });
                      handleLogout();
                    }}
                  >
                    <img src={exit} alt="logout" className="exit" />
                  </div>

                  <Link to="/settings">
                    <div
                      className="settings-icon"
                      onClick={() => {
                        ReactGA.event({
                          category: "Icon",
                          action: "Click",
                          label: "Settings Icon",
                        });
                      }}
                    >
                      <img src={settings} alt="settings" clasName="settings" />
                    </div>
                  </Link>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="profile-image">
              <img
                src={!data.profilePic ? unknown : data.profilePic}
                alt="profile"
                className="profile"
              />

              <div className="name-and-username">
                <strong style={{ zIndex: "1" }}>
                  {!data.name ? t("Profile.user") : data.name}
                </strong>
                <strong style={{ zIndex: "1" }} className="mobile-username">
                  {!data.username ? "@user" : data.username}
                </strong>
                {rIsLoading ? (
                  ""
                ) : userId === currentUser["user"].id ? (
                  <div>
                    <Link to={`/profile/${currentUser["user"].id}/edit`}>
                      <button className="edit-profile">
                        {t("Profile.editProfile")}
                      </button>
                    </Link>
                    <div className="translate-content">
                      <div
                        className="dropdown-content"
                        onClick={ReactGA.event({
                          category: "Event",
                          action: "Click",
                          label: "Language Change Event",
                        })}
                      >
                        <select
                          value={lData.language}
                          onChange={handleLanguageChange}
                        >
                          <option value="en">English</option>
                          <option value="ar">Arabic</option>
                          <option value="zh">Chinese</option>
                          <option value="fil">Filipino</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="hi">Hindi</option>
                          <option value="id">Indonesian</option>
                          <option value="ja">Japanese</option>
                          <option value="ko">Korean</option>
                          <option value="pt">Portuguese</option>
                          <option value="pol">Polish</option>
                          <option value="ru">Russian</option>
                          <option value="es">Spanish</option>
                          <option value="tha">Thai</option>
                          <option value="tr">Turkish</option>
                          <option value="ukr">Ukrainian</option>
                          <option value="vi">Vietnamese</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    className="support-btn-mobile"
                    onClick={handleSupport}
                  >
                    {relationshipData &&
                    relationshipData.includes(currentUser["user"].id)
                      ? "Supporting"
                      : "Support"}
                  </button>
                )}
              </div>
            </div>

            <div className="about">
              <h3>{t("Profile.about")}</h3>
              <strong className="about-content">
                {!data.about ? t("Profile.aboutDesc") : data.about}
              </strong>

              <div className="others">
                <div className="icon-display">
                  <img src={book} className="icons" alt="book" />
                  <h6 className="icon-text">
                    {!data.education ? t("Profile.education") : data.education}
                  </h6>
                </div>
                <div className="icon-display">
                  <img src={location} className="icons" alt="location" />
                  <h6 className="icon-text">
                    {!data.location ? t("Profile.location") : data.location}
                  </h6>
                </div>
                <div className="icon-display">
                  <img src={gender} className="icons" alt="age" />
                  <h6 className="icon-text">
                    {!data.gender ? t("Profile.gender") : data.gender}
                  </h6>
                </div>
                <div className="icon-display">
                  <img src={users} className="icons" alt="supporters" />
                  <h6 className="icon-text">
                    {!sIsData || sIsData === 0
                      ? t("Profile.supporters")
                      : sIsData}
                  </h6>
                </div>

                <div className="edit-btn">
                  {rIsLoading ? (
                    ""
                  ) : userId === currentUser["user"].id ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {" "}
                      <Link
                        to="/feedback"
                        className="feedback"
                        onClick={ReactGA.event({
                          category: "Link",
                          action: "Click",
                          label: "Feedback Form Link",
                        })}
                      >
                        {t("Profile.feedback")}
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <Images userId={userId} />
              </div>
              <div style={{ display: "none" }}>
                <Selposts userId={userId} />
              </div>
            </div>
          </div>
        </>
      )}

      {data && (
        <div className="desktop-profile-page">
          <NavBar />

          <div className="profile-container">
            <div className="profile-side">
              <div className="profile-image-container">
                <img
                  src={!data.profilePic ? unknown : data.profilePic}
                  alt="profile"
                  className="profile"
                />

                <strong className="name">
                  {!data.name ? "Unknown" : data.name}
                </strong>
                <p className="username">
                  {!data.username ? "@unknown" : data.username}
                </p>
                <h5 className="about">
                  {!data.about ? "Tell something about yourself" : data.about}
                </h5>
                {userId === currentUser["user"].id ? (
                  ""
                ) : (
                  <button className="support" onClick={handleSupport}>
                    {relationshipData &&
                    relationshipData.includes(currentUser["user"].id)
                      ? "Supporting"
                      : "Support"}
                  </button>
                )}

                {rIsLoading ? (
                  ""
                ) : userId === currentUser["user"].id ? (
                  <div>
                    <Link to={`/profile/${currentUser["user"].id}/edit`}>
                      <button>Edit Profile</button>
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                <div className="others">
                  <div className="icon-display">
                    <img src={book} className="icons" alt="book" />
                    <h6 className="icon-text">
                      {!data.education ? "Education" : data.education}
                    </h6>
                  </div>
                  <div className="icon-display">
                    <img src={location} className="icons" alt="location" />
                    <h6 className="icon-text">
                      {!data.location ? "Location" : data.location}
                    </h6>
                  </div>
                  <div className="icon-display">
                    <img src={gender} className="icons" alt="age" />
                    <h6 className="icon-text">
                      {!data.gender ? "Gender" : data.gender}
                    </h6>
                  </div>
                  <div className="icon-display">
                    <img src={users} className="icons" alt="supporters" />
                    <h6 className="icon-text">
                      {!sIsData || sIsData === 0
                        ? t("Profile.supporters")
                        : sIsData + t("Profile.supporters")}
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className="cover-side">
              <img src={cover} alt="cover" className="cover" />

              <div className="btns">
                {rIsLoading ? (
                  ""
                ) : userId === currentUser["user"].id ? (
                  <div onClick={handleLogout}>
                    <img src={exit} alt="logout" className="exit" />
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div>
                <Images userId={userId} />
              </div>
              <div style={{ display: "none" }}>
                <SearchBar userId={userId} />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="update" style={{ display: "none" }}>
        <EditProfile user={data} />
      </div>
    </div>
  );
};

export default ProfilePage;
