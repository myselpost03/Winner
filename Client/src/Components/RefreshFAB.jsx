import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import "./RefreshFAB.scss";

const RefreshFAB = ({handleClick}) => {
  return (
    <div className="refresh-floating-action-button">
      <FontAwesomeIcon icon={faRefresh} onClick={handleClick} />
    </div>
  );
};

export default RefreshFAB;
