import React from "react";
import "./Collection.scss";

import BottomTabs from "./BottomTabs";

const Collection = ({ collection }) => {
  return (
    <div className="image-grid">
      <div className="mobile">
        <div className="selposts">
          <div className="image-item">
            <img src={collection.img} alt="selpost" className="mapped-images" />
          </div>
        </div>
  
      </div>
      <div className="desktop">
        <div className="sel">
          <div className="sel-item">
            <img src={collection.img} alt="selpost" className="collection-images" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
