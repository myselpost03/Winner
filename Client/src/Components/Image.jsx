import React from "react";
import "./Image.scss";

const Image = ({ image }) => {
  return (
    <div className="image-grid">
      <div className="mobile">
        <div className="image-sel">
          <div className="image-item">
            <img src={image.img} alt="selpost" className="mapped-images" />
          </div>
        </div>
      </div>
      <div className="desktop">
        <div className="image-sel">
          <div className="image-item">
            <img src={image.img} alt="selpost" className="mapped-images" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Image;
