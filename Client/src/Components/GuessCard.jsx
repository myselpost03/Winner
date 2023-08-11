import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { RWebShare } from "react-web-share";
import { AuthContext } from "../Context/authContext";
import { makeRequest } from "../axios";
import HintsPopup from "./HintsPopup";
import PassedPopup from "./PassedPopup";
import AnswerPopup from "./AnswerPopup";
import FinishedPopup from "./FinishedPopup";
import coin from "../Icons/coin.png";
import hint from "../Icons/hint.png";
import share from "../Icons/share.png";
import answer from "../Icons/answer.png";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import "./GuessCard.scss";

const GuessCard = ({ cards }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [cardPosition, setCardPosition] = useState(0);
  const [title, setTitle] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPassedPopup, setShowPassedPopup] = useState(false);
  const [showAnswerPopup, setShowAnswerPopup] = useState(false);
  const [showFinishedPopup, setShowFinishedPopup] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const { t } = useTranslation();

  const handleTouchStart = (e) => {
    setOffsetX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (isSwiping) {
      const deltaX = e.touches[0].clientX - offsetX;
      setOffsetX(e.touches[0].clientX);

      // Check if the user has reached the last card
      if (currentCard === cards.length - 1 && deltaX > 0) {
        // If on the last card and trying to move right, set cardPosition to 0
        setCardPosition(0);
      } else if (currentCard === 0 && deltaX < 0) {
        // If on the first card and trying to move left, set cardPosition to 0
        setCardPosition(0);
      } else {
        setCardPosition((prevPosition) => prevPosition + deltaX);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    if (cardPosition < -100) {
      setCurrentCard((prevCard) => prevCard + 1);
    } else if (cardPosition > 100) {
      setCurrentCard((prevCard) => prevCard + 1);
    }

    setCardPosition(0);
  };

  const handleButtonClick = (direction) => {
    if (direction === "left") {
      setCurrentCard((prevCard) => prevCard + 1);
    } else if (direction === "right") {
      setCurrentCard((prevCard) => prevCard + 1);
    }
  };

  const handleInputChange = (e) => {
    const lowercaseValue = e.target.value.toLowerCase();
    setTitle(lowercaseValue);

    const currentCardItem = cards[currentCard];

    if (lowercaseValue === currentCardItem.title) {
      const updatedNumber = number + 10;

      makeRequest
        .put("/guesses/coins", {
          id: currentUser["user"].id,
          coins: updatedNumber,
        })
        .then((response) => {
          setNumber(updatedNumber);
        })
        .catch((error) => {
          console.error("Error updating coins:", error);
        });
    }
  };

  const currentCardItem = cards[currentCard];

  const handleAnswer = () => {
    try {
      setShowAnswerPopup(true);
      const updatedNumber = number - 10;

      if (updatedNumber >= 0) {
        makeRequest
          .put("/guesses/coins", {
            id: currentUser["user"].id,
            coins: updatedNumber,
          })
          .then((response) => {
            setNumber(updatedNumber);
          })
          .catch((error) => {
            console.error("Error updating coins:", error);
          });
      } else {
        setShowAnswerPopup(false);
        setShowFinishedPopup(true);
      }
    } catch (err) {
      console.log("Error occured showing answer popop in guess card", err);
    }
  };

  const handleCloseAnswerPopup = () => {
    setShowAnswerPopup(false);
  };

  const handleHint = async () => {
    try {
      setShowPopup(true);
      const updatedNumber = number - 10;

      if (updatedNumber >= 0) {
        try {
          await makeRequest.put("/guesses/coins", {
            id: currentUser["user"].id,
            coins: updatedNumber,
          });
          setNumber(updatedNumber);
        } catch (error) {
          console.error("Error updating coins:", error);
        }
      } else {
        setShowPopup(false);
        setShowFinishedPopup(true);
      }
    } catch (err) {
      console.log("Error occured showing hint popup in guess card", err);
    }
  };

  const handleFillCoin = async () => {
    try {
      if (number <= 0) {
        const updatedNumber = number + 30;
        try {
          await makeRequest.put("/guesses/coins", {
            id: currentUser["user"].id,
            coins: updatedNumber,
          });
          setNumber(updatedNumber);
        } catch (error) {
          console.error("Error updating coins:", error);
        }
      }
    } catch (err) {
      console.log("Erro occured filling the coins in guess card", err);
    }
  };

  const handleClosePassedPopup = () => {
    setShowPassedPopup(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCloseFinishedPopup = () => {
    setShowFinishedPopup(false);
  };

  const { isLoading, error, data } = useQuery(["coins"], () =>
    makeRequest.get("/guesses/coins?userId=" + currentUser["user"].id).then((res) => {
      return res.data;
    })
  );

  const [number, setNumber] = useState(50);

  useEffect(() => {
    try {
      if (currentCardItem && currentCardItem.title === title) {
        setShowPassedPopup(true);
        setTitle("");
      }
    } catch (err) {
      console.log("Error occured showing passed popup in guess card", err);
    }
  }, [currentCardItem, title]);

  useEffect(() => {
    try {
      if (!isLoading && data && data.length > 0) {
        setNumber(data[0].coins);
      }
    } catch (err) {
      console.log("Error occured setting coins in guess card", err);
    }
  }, [isLoading, data]);

  if (error) {
    return <div className="guesses">{t("Error.error")}</div>;
  }

  if (isLoading) {
    return <div className="guesses">{t("Loading.loading")}</div>;
  }

  return (
    <div className="guess-card">
      <div className="mobile-guess-card">
        <div className="hint-and-reveal">
          <img src={hint} alt="light bulb" onClick={handleHint} />
          <img src={answer} alt="eye" onClick={handleAnswer} />
        </div>
        <div className="coins">
          <strong className="number">{number}</strong>
          <img src={coin} alt="coin" className="coin" />
          <RWebShare
            data={{
              text: t("GuessCard.shareText"),
              url: "https://myselpost.com",
              title: "MySelpost",
            }}
            onClick={() => {
              ReactGA.event({
                category: "Icon",
                action: "Click",
                label: "Share Icon",
              });
              handleFillCoin();
            }}
          >
            <img src={share} alt="share" className="share" />
          </RWebShare>
        </div>

        {cards.map((card, index) => {
          if (card.img) {
            return (
              <div
                key={index}
                className={`card ${index === currentCard ? "active" : ""}`}
                style={{
                  transform: `translateX(${
                    index === currentCard ? cardPosition : 0
                  }px)`,
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img key={index} src={card.img} alt="selfie" />
                {currentCardItem && (
                  <input
                    type="text"
                    placeholder={t("GuessCard.placeholder")}
                    value={title}
                    onChange={handleInputChange}
                    className="guess-input"
                    disabled={isDisabled}
                  />
                )}
              </div>
            );
          }
          return null;
        })}

        {showPopup && (
          <HintsPopup
            message={`${currentCardItem.hint}`}
            onClose={handleClosePopup}
          />
        )}

        {showAnswerPopup && (
          <AnswerPopup
            answer={`${currentCardItem.title}`}
            onClose={handleCloseAnswerPopup}
          />
        )}

        {showPassedPopup && (
          <PassedPopup onClose={handleClosePassedPopup} coinsEarned={number} />
        )}

        {showFinishedPopup && (
          <FinishedPopup
            finish={t("GuessCard.finishedMsg")}
            onClose={handleCloseFinishedPopup}
          />
        )}

        <div
          className="buttons"
          style={{ marginRight: "10%", position: "fixed", zIndex: "-99" }}
        >
          <button
            onClick={() => {
              ReactGA.event({
                category: "Swipe",
                action: "Swipe",
                label: "Left Swipe",
              });
              handleButtonClick("left");
            }}
            disabled={currentCard === cards.length - 1}
          >
            Swipe Left
          </button>
          <button
            onClick={() => handleButtonClick("right")}
            disabled={currentCard === cards.length - 1}
          >
            Swipe Right
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuessCard;
