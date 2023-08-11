import React from "react";
import { Link } from "react-router-dom";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import BottomTabs from "../../Components/BottomTabs";
import Selposts from "../../Components/Selposts";
import SideBar from "../../Components/SideBar";
import TrendingBar from "../../Components/TrendingBar";
import SuggestionCard from "../../Components/SuggestionCard";
import NavBar from "../../Components/NavBar";
import MobileNavbar from "../../Components/MobileNavbar";
import Logo from "../../Images/logo.png";
import "./HomePage.scss";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <div className="mobile-home-page">
        <MobileNavbar />

        <div
          className="selposts"
          style={{
            backgroundColor: "#EEEEEE",
            height: "100vh",
            paddingTop: "5rem",
          }}
        >
          {" "}
          <Link to="/selfie-of-the-day" className="sod">
            {t("Sod.sod")} &#x1F933;
          </Link>
          <Selposts />
        </div>
        <div className="tabs">
          <BottomTabs />
        </div>
      </div>
      <div className="desktop-home-page">
        <NavBar />
        <div className="equal">
          <div className="logo">
            <img src={Logo} alt="logo" />
            <SuggestionCard />
            <SideBar />
          </div>

          <div
            style={{
              paddingTop: "4.8rem",
              justifyContent: "center",
              display: "flex",
              flexDirection: "row",
              marginLeft: "15%",
            }}
          >
            <Selposts />
          </div>

          <div className="trending" style={{ marginTop: "11%" }}>
            <TrendingBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
