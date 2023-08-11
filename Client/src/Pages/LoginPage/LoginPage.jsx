import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import firstSelfie from "../../Images/firstselfie.jpg";
import secondSelfie from "../../Images/secondselfie.jpg";
import thirdSelfie from "../../Images/thirdselfie.jpg";
import fourthSelfie from "../../Images/fourthselfie.jpg";
import Logo from "../../Images/logo.png";
import ReactGA from "react-ga";
import { AuthContext } from "../../Context/authContext";
import "./LoginPage.scss";

const LoginPage = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErr, setLoginErr] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  //! Login Request
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
    setLoginErr(false);
  };

  useEffect(() => {
    const isMobile = window.matchMedia(
      "(min-width: 320px) and (max-width: 480px)"
    ).matches;

    if (isMobile) {
      const userLoggedIn = localStorage.getItem("userLoggedIn") === "true";

      if (userLoggedIn) {
        navigate("/home");
      }
    }
  }, []);

  return (
    <div>
      <div className="mobile-login-page" onClick={handleHide}>
        <div className="image-container">
          <div className="first-frame">
            <img id="first-selfie" src={firstSelfie} alt="man taking selfie" />
            <img
              id="second-selfie"
              src={secondSelfie}
              alt="family taking selfie"
            />
          </div>
          <div className="logo">
            <img id="logo" src={Logo} alt="logo" />
          </div>
          <div className="second-frame">
            <img id="third-selfie" src={thirdSelfie} alt="man taking selfie" />
            <img
              id="fourth-selfie"
              src={fourthSelfie}
              alt="girl taking selfie"
            />
          </div>
        </div>
        <div className="form">
          <div className="slogan-container">
            <h1>MySelpost</h1>
            <p>selfies on the way</p>
          </div>
          <div className="username-input">
            <input
              type="text"
              placeholder="Username"
              id="loginUsername"
              name="loginUsername"
              value={loginUsername}
              onChange={(event) =>
                setLoginUsername(event.target.value.toLowerCase())
              }
              requires={true.toString()}
            />
          </div>
          <div className="password-input">
            <input
              type="password"
              placeholder="Password"
              id="loginPassword"
              name="loginPassword"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              requires={true.toString()}
            />
          </div>
          <div className="login-error">{loginErr && loginErr}</div>
          <div className="login-btn">
            <button
              onClick={() => {
                ReactGA.event({
                  category: "Button",
                  action: "Click",
                  label: "Login Button",
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
              {loggingIn ? "Logging In..." : "Log In"}
            </button>
          </div>
          <div className="link-to-signup">
            <p>Not a member? </p>
            <Link
              to="/register"
              style={{
                fontSize: "0.78rem",
                padding: "1.8% 0 0 1%",
                color: "#4169e1",
                textDecoration: "none",
                fontFamily: '"paytone one", serif',
              }}
            >
              <strong>Signup now</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
