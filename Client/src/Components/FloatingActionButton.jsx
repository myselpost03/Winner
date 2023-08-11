import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import "./FloatingActionButton.scss";

const FloatingActionButton = () => {
  return (
    <div className="floating-action-button">
      <Link to="/create-guess" className="link">
        <FontAwesomeIcon icon={faCirclePlus} />
      </Link>
    </div>
  );
};

export default FloatingActionButton;
