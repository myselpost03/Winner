import React, { useState, useEffect } from "react";
import GuessCards from "../../Components/GuessCards";
import BrowserPopup from "../../Components/BrowserPopup";
import BottomTabs from "../../Components/BottomTabs";
import FloatingActionButton from "../../Components/FloatingActionButton";
import "./GuessPage.scss";

const GuessPage = () => {
  const [showBrowserPopup, setShowBrowserPopup] = useState(false);

  const targetVersion = 114;

  useEffect(() => {
    try {
      const userAgent = window.navigator.userAgent;
      const chromeMatch = userAgent.match(/Chrome\/([0-9.]+)/);
      const chromeVersion = chromeMatch ? chromeMatch[1] : "";

      if (parseFloat(chromeVersion) < targetVersion) {
        setShowBrowserPopup(true);
      } else {
        setShowBrowserPopup(false);
      }
    } catch (err) {
      console.log("Error occured showing browser popup in home page", err);
    }
  }, []);

  //! Update browser url
  const updateBrowser = () => {
    try {
      window.location.href = "https://www.google.com/chrome/";
      setShowBrowserPopup(false);
    } catch (err) {
      console.log("Error occured updating browser", err);
    }
  };

  return (
    <div
      style={{ backgroundColor: "#F0F8FF", minHeight: "100vh" }}
      className="guess-page"
    >
      <BottomTabs />
      <FloatingActionButton />
      <GuessCards />
      {showBrowserPopup && <BrowserPopup onUpdate={updateBrowser} />}
    </div>
  );
};

export default GuessPage;
