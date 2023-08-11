import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RWebShare } from "react-web-share";
import "./RegisterPage.scss";
import firstSelfie from "../../Images/firstselfie.jpg";
import fourthSelfie from "../../Images/fourthselfie.jpg";
import sixthSelfie from "../../Images/thirdselfie.jpg";
import firstInbox from "../../Images/firstinbox.jpg";
import secondInbox from "../../Images/secondinbox.jpg";
import thirdInbox from "../../Images/thirdinbox.png";
import firstWorld from "../../Images/firstworld.png";
import secondWorld from "../../Images/secondworld.png";
import thirdWorld from "../../Images/thirdworld.jpg";
import seventhSelfie from "../../Images/seventhselfie.jpg";
import eighthSelfie from "../../Images/eighthselfie.jpg";
import ninthSelfie from "../../Images/ninthselfie.png";
import one from "../../Images/1.jpg";
import two from "../../Images/2.jpg";
import three from "../../Images/3.jpg";
import four from "../../Images/4.jpg";
import five from "../../Images/5.jpg";
import six from "../../Images/6.png";
import axios from "axios";
import ReactGA from "react-ga";
import { AuthContext } from "../../Context/authContext";
import SuccessPopup from "../../Components/SuccessPopup";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loginErr, setLoginErr] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const navigate = useNavigate();

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  //! Register Request
  const handleClick = (event) => {
    if (event) {
      event.preventDefault();
    }

    try {
      setSigningUp(true);
      axios
        .post("https://cloud-server.cyclic.app/api/auth/register", {
          username,
          password,
        })
        .then((response) => {
          console.log(response.data);
          setUsername("");
          setPassword("");
          setShowPopup(true);
        })

        .catch((error) => {
          if (error) {
            setErr("User already exists");
          } else {
            console.log("An error occurred:", error.message);
          }
        });
    } catch (err) {
      console.log("Error occured registering a user", err);
    } finally {
      setSigningUp(false);
    }
  };

  //! Login Request
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    if (e) {
      e.preventDefault();
    }

    try {
      setLoggingIn(true);
      await login(loginUsername, loginPassword);
      localStorage.setItem("userLoggedIn", "true");
      navigate("/home");
    } catch (error) {
      setLoginErr(error.response.data);
    } finally {
      setLoggingIn(false);
    }

    setLoginUsername("");
    setLoginPassword("");
  };

  //! Hide Errors
  const handleHide = () => {
    setErr(false);
    setLoginErr(false);
  };

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn") === "true";

    if (userLoggedIn) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="register">
      <div className="mobile-register-page" onClick={handleHide}>
        <div className="form">
          <h3>Welcome To MySelpost</h3>
          <input
            type="text"
            placeholder="Username"
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value.toLowerCase())}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value.trim(""))}
          />
          <div className="error">
            <p>{err}</p>
          </div>
          <button
            onClick={() => {
              ReactGA.event({
                category: "Button",
                action: "Click",
                label: "Signup Button",
              });
              handleClick();
            }}
            disabled={!username && !password ? true : false}
            className={
              !username && !password ? "disable-button" : "enable-button"
            }
            style={{ marginTop: "-5%" }}
          >
          {signingUp ? "Signing Up..." : "Sign Up"}
          </button>
          <RWebShare
            data={{
              text: "Share your selfies with a secret message!",
              url: "https://myselpost.com",
              title: "MySelpost",
            }}
            onClick={() => {
              ReactGA.event({
                category: "Button",
                action: "Click",
                label: "Invite Button",
              });
            }}
          >
            <button className="enable-button">Invite Peers</button>
          </RWebShare>
          {showPopup && (
            <SuccessPopup
              message="Registered successfully. Now you can Log In!"
              onClose={handleClosePopup}
            />
          )}
          <div>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                margin: "1% 0 0 1%",
              }}
              className="link-to-login"
            >
              <span className="account-text" style={{ textDecoration: "none" }}>
                Have an account?
              </span>
              <span className="login-text">Login now</span>
            </Link>
          </div>
        </div>
        <div className="mobile-bottom-content">
          {/*<Link
            to=""
            style={{
              textDecoration: "none",
              color: "#eee",
              fontSize: "0.6rem",
            }}
          >
            Terms of use
          </Link>*/}
        </div>
      </div>

      <div className="desktop-register-page" onClick={handleHide}>
        <div className="navbar">
          <div className="title">
            <h1>MySelpost</h1>
          </div>

          <div className="login-inputs">
            <div className="login-error">{loginErr && loginErr}</div>
            <input
              type="text"
              placeholder="Username"
              id="loginUsername"
              name="loginUsername"
              value={loginUsername}
              onChange={(event) => setLoginUsername(event.target.value)}
              requires={true.toString()}
            />
            <input
              type="password"
              placeholder="Password"
              id="loginPassword"
              name="loginPassword"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value.trim())}
              requires={true.toString()}
            />

            <button
              onClick={() => {
                ReactGA.event({
                  category: "Button",
                  action: "Click",
                  label: "Desktop Login Button",
                });
                handleLogin();
              }}
              disabled={!loginUsername && !loginPassword}
              className={
                !loginUsername && !loginPassword
                  ? "disable-button"
                  : "enable-button"
              }
            >
              {loggingIn ? "Logging.." : "Log In"}
            </button>
          </div>
        </div>

        <div className="frames">
          <div className="first-frame">
            <div className="first-content">
              <div className="stack">
                <img src={fourthSelfie} alt="girl taking selfie" />
                <img src={firstSelfie} alt="man taking selfie" />
                <img src={sixthSelfie} alt="skydiver taking selfie" />
              </div>
              <div className="first-collection">
                <img src={seventhSelfie} alt="inbox" />
                <img src={eighthSelfie} alt="chat vector" />
                <img src={ninthSelfie} alt="smartphone vector" />
              </div>
            </div>

            <div className="second-content">
              <div className="second-stack">
                <img src={secondInbox} alt="inbox" />
                <img src={thirdInbox} alt="inbox" />
                <img src={firstInbox} alt="inbox" />
              </div>
              <div className="second-collection">
                <img src={one} alt="girl taking selfie" />
                <img src={two} alt="couple taking selfie" />
                <img src={three} alt="vector girl taking selfie" />
              </div>
            </div>
            <div className="third-content">
              <div className="third-stack">
                <img src={thirdWorld} alt="world" />
                <img src={secondWorld} alt="map" />
                <img src={firstWorld} alt="earth" />
              </div>
              <div className="third-collection">
                <img src={four} alt="man taking selfie" />
                <img src={five} alt="people taking selfie" />
                <img src={six} alt="girl taking selfie" />
              </div>
            </div>
          </div>

          <div className="second-frame">
            <div className="form">
              <div className="signup-inputs">
                <h4>Join MySelpost</h4>
                <p>
                  MySelpost is the place where people share their selfies only
                  with a secret message to their friends or world. Let's connect
                  your selfies to the world.
                </p>
                <div className="inputs">
                  <strong className="small-line" style={{ color: "#fff" }}>
                    No Email Needed!
                  </strong>
                  <input
                    className="username-input"
                    type="text"
                    placeholder="Username"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value.toLowerCase())
                    }
                    requires={true.toString()}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value.trim(""))
                    }
                    requires={true.toString()}
                  />
                  <div className="desktop-error">
                    <strong className="error">{err}</strong>
                  </div>
                  <button
                    onClick={() => {
                      ReactGA.event({
                        category: "Button",
                        action: "Click",
                        label: "Desktop Signup Button",
                      });
                      handleClick();
                    }}
                    disabled={!username && !password ? true : false}
                    className={!username && !password ? "off" : "on"}
                  >
                    {signingUp ? "Joining..." : "Join"}
                  </button>

                  {showPopup && (
                    <SuccessPopup
                      message="Registered successfully!"
                      onClose={handleClosePopup}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*<div className="bottom-content">
          <Link
            to=""
            style={{
              padding: "1rem",
              textDecoration: "none",
              textAlign: "center",
              color: "#ccc9c9",
            }}
          >
            About
          </Link>
          <Link to="">Terms</Link>
          <Link to="">Privacy Policy</Link>
          <Link to="">Cookies Policy</Link>
          <Link to="">Donate</Link>
          <Link to="">Terms</Link>
          <Link to="">Blogs</Link>
        </div>*/}
      </div>
    </div>
  );
};

export default RegisterPage;
