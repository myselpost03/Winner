import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import AddHeader from "../../Components/AddHeader";
import "./PrivacyPage.scss";

const PrivacyPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/settings");
  };

  return (
    <div className="privacy-page">
      <div className="mobile-privacy">
        <AddHeader title="Privacy" onBack={handleBack} />
        <h1 className="privacy-policy">Privacy Policy</h1>
        <h4 className="last">Last updated: 13-07-2023</h4>
        <p>
          This Privacy Policy governs the manner in which MySelpost collects,
          uses, maintains, and discloses information collected from users of the
          www.myselpost.com website.
        </p>
        <h4 className="collect">Information We Collect</h4>
        <p>
          We may collect personal identification information from Users in a
          variety of ways, including, but not limited to, when Users visit our
          Platform, register on the Platform, fill out a form, and in connection
          with other activities, services, features, or resources we make
          available on our Platform. Users may be asked for their name, email
          address, username, password, and other relevant information. We will
          collect personal identification information from Users only if they
          voluntarily submit such information to us. Users can always refuse to
          supply personally identification information, except that it may
          prevent them from engaging in certain Platform-related activities.
          Non-personal identification information We may collect non-personal
          identification information about Users whenever they interact with our
          Platform. Non-personal identification information may include the
          browser name, the type of computer or device, and technical
          information about Users' means of connection to our Platform, such as
          the operating system and the Internet service providers utilized, and
          other similar information.
        </p>
        <h4 className="cookies">Web Browser Cookies</h4>
        <p>
          Our Platform may use "cookies" to enhance User experience. Users' web
          browsers place cookies on their hard drive for record-keeping purposes
          and sometimes to track information about them. Users may choose to set
          their web browser to refuse cookies or to alert them when cookies are
          being sent. If they do so, note that some parts of the Platform may
          not function properly.
        </p>
        <h4 className="info">How We Use Collected Information</h4>
        <p>
          MySelpost may collect and use Users' personal information for the
          following purposes: To personalize User experience: We may use
          information in the aggregate to understand how our Users as a group
          use the services and resources provided on our Platform. To improve
          our Platform: We continually strive to improve our Platform offerings
          based on the information and feedback we receive from Users. To send
          periodic emails: We may use the email address to respond to User
          inquiries, questions, and/or other requests.
        </p>
        <h4 className="protect">How We Protect Your Information</h4>
        <p>
          We adopt appropriate data collection, storage, and processing
          practices and security measures to protect against unauthorized
          access, alteration, disclosure, or destruction of your personal
          information, username, password, transaction information, and data
          stored on our Platform.
        </p>
        <h4 className="terms">Your Acceptance of These Terms</h4>
        <p>
          By using our Platform, you signify your acceptance of this Privacy
          Policy. If you do not agree to this Privacy Policy, please do not use
          our Platform. Your continued use of the Platform following the posting
          of changes to this Privacy Policy will be deemed your acceptance of
          those changes.
        </p>
      </div>
      <div className="privacy">
        <NavBar />
        <h1>Privacy Policy</h1>
        <h4 className="last">Last updated: 06-06-2023</h4>
        <p>
          This Privacy Policy governs the manner in which MySelpost collects,
          uses, maintains, and discloses information collected from users of the
          www.myselpost.com website.
        </p>
        <h4 className="collect">Information We Collect</h4>
        <p>
          We may collect personal identification information from Users in a
          variety of ways, including, but not limited to, when Users visit our
          Platform, register on the Platform, fill out a form, and in connection
          with other activities, services, features, or resources we make
          available on our Platform. Users may be asked for their name, email
          address, username, password, and other relevant information. We will
          collect personal identification information from Users only if they
          voluntarily submit such information to us. Users can always refuse to
          supply personally identification information, except that it may
          prevent them from engaging in certain Platform-related activities.
          Non-personal identification information We may collect non-personal
          identification information about Users whenever they interact with our
          Platform. Non-personal identification information may include the
          browser name, the type of computer or device, and technical
          information about Users' means of connection to our Platform, such as
          the operating system and the Internet service providers utilized, and
          other similar information.
        </p>
        <h4 className="cookies">Web Browser Cookies</h4>
        <p>
          Our Platform may use "cookies" to enhance User experience. Users' web
          browsers place cookies on their hard drive for record-keeping purposes
          and sometimes to track information about them. Users may choose to set
          their web browser to refuse cookies or to alert them when cookies are
          being sent. If they do so, note that some parts of the Platform may
          not function properly.
        </p>
        <h4 className="info">How We Use Collected Information</h4>
        <p>
          MySelpost may collect and use Users' personal information for the
          following purposes: To personalize User experience: We may use
          information in the aggregate to understand how our Users as a group
          use the services and resources provided on our Platform. To improve
          our Platform: We continually strive to improve our Platform offerings
          based on the information and feedback we receive from Users. To send
          periodic emails: We may use the email address to respond to User
          inquiries, questions, and/or other requests.
        </p>
        <h4 className="protect">How We Protect Your Information</h4>
        <p>
          We adopt appropriate data collection, storage, and processing
          practices and security measures to protect against unauthorized
          access, alteration, disclosure, or destruction of your personal
          information, username, password, transaction information, and data
          stored on our Platform.
        </p>
        <h4 className="terms">Your Acceptance of These Terms</h4>
        <p>
          By using our Platform, you signify your acceptance of this Privacy
          Policy. If you do not agree to this Privacy Policy, please do not use
          our Platform. Your continued use of the Platform following the posting
          of changes to this Privacy Policy will be deemed your acceptance of
          those changes.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
