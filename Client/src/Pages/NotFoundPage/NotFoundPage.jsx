import React from "react";
import notFound from "../../Images/notFound.jpg";
import "./NotFoundPage.scss";

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <img src={notFound} alt="Page not found" />
      <p>Image by storyset on Freepik</p>
    </div>
  );
};

export default NotFoundPage;
