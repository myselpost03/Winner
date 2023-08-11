import React from "react";
import { useNavigate, Link } from "react-router-dom";
import AddHeader from "../../Components/AddHeader";
import "./TermsPage.scss";

const TermsPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/settings");
  };
  return (
    <div>
      <AddHeader title="Terms" onBack={handleBack} />
      <div className="terms-container">
        <h1 className="terms-of-use">Terms of Use</h1>
        <p>
          Welcome to our MySelpost! These Terms of Use govern your use of our
          website and services. By accessing or using our website, you agree to
          comply with these terms.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using our social media platform, you acknowledge that
          you have read, understood, and agree to be bound by these terms of
          use.
        </p>
        <h2>2. User Conduct</h2>
        <p>
          When using our platform, you must comply with the following rules of
          conduct:
          <ul>
            <li>
              Respect other users and refrain from posting offensive or harmful
              content.
            </li>
            <li>
              Do not engage in any illegal activities or encourage others to do
              so.
            </li>
            <li>
              Protect your account credentials and do not share them with
              others.
            </li>
          </ul>
        </p>

        <h2>3. Intellectual Property</h2>
        <p>
          All content and materials available on our platform are protected by
          intellectual property rights. You may not use, reproduce, or
          distribute any of the content without obtaining permission from the
          respective owners.
        </p>

        <h2>4. Privacy</h2>
        <p>
          We value your privacy and are committed to protecting your personal
          information. Please review our{" "}
          <Link to="/privacy">Privacy Policy</Link> for more information on how
          we collect, use, and disclose data.
        </p>

        <h2>5. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to our
          platform if you violate any of the terms of use or engage in any
          activities that are harmful to the community.
        </p>

        <p>
          Please note that this is a basic example, and you should tailor the
          terms of use to your specific social media platform and legal
          requirements.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
