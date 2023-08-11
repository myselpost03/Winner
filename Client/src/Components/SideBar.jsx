import React from "react";
import { Link } from "react-router-dom";

import "./SideBar.scss";

const SideBar = () => {
  return (
    <div className="sidebar">
      <ul>
        <Link to="/about" style={{ textDecoration: "none" }}>
          <li>About</li>
        </Link>
        <Link to="/feedback" style={{ textDecoration: "none" }}>
          <li>Feedback</li>
        </Link>
        <Link to="/privacy" style={{ textDecoration: "none" }}>
          <li>Privacy</li>
        </Link>
      </ul>
    </div>
  );
};

export default SideBar;
