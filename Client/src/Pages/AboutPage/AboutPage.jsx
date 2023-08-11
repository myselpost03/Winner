import React from "react";
import { useNavigate } from "react-router-dom";
import AddHeader from "../../Components/AddHeader";
import NavBar from "../../Components/NavBar";
import "./AboutPage.scss";

const AboutPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/settings");
  };
  return (
    <div className="about">
      <div className="mobile-about-page">
        <AddHeader title="About" onBack={handleBack} />

        <div className="mission">
          <h1 className="mission-heading">Our Mission</h1>
          <p className="mission-paragraph">
            At our social network, our mission is to foster meaningful
            connections and nurture a thriving online community for sharing
            selfies and creating a large network of slefies. We are committed to
            creating a platform where individuals can connect, share, and engage
            with others who share their passions and interests. Our goal is to
            provide a safe and inclusive space to share selfies and connect with
            the world.{" "}
          </p>
          <h1 className="story">Our Story</h1>
          <p className="story">
            Once upon a time, in a Delhi city, there was a passionate individual
            named Anuj. Anuj had always dreamed of making a difference in the
            world by creating a unique online platform. With a burning desire to
            connect people, Anuj embarked on an exciting journey to start their
            own website. With a clear vision in mind, Anuj spent countless hours
            brainstorming ideas, researching industry trends, and outlining the
            core purpose of the website. The goal was to build a platform that
            would empower users to explore their passions for selfies, connect
            with like-minded individuals, and exchange selfies. Along the way,
            there were hurdles to overcome. Technical issues, resource
            constraints, and the ever-evolving nature of the digital landscape
            tested their perseverance. However, fueled by their unwavering
            commitment and the belief in their vision, they tackled each
            obstacle head-on, learning and growing with every setback. And so,
            the story of the website continues, with new chapters being written
            every day as the community grows, evolves, and leaves an indelible
            mark on the digital landscape.
          </p>
        </div>
      </div>
      <div className="about-page">
        <NavBar />

        <div className="mission">
          <h1 className="mission-heading">Our Mission</h1>
          <p className="mission-paragraph">
            At our social network, our mission is to foster meaningful
            connections and nurture a thriving online community for sharing
            selfies and creating a large network of slefies. We are committed to
            creating a platform where individuals can connect, share, and engage
            with others who share their passions and interests. Our goal is to
            provide a safe and inclusive space to share selfies and connect with
            the world.{" "}
          </p>
          <h1 className="story">Our Story</h1>
          <p className="story">
            Once upon a time, in a Delhi city, there was a passionate individual
            named Anuj. Anuj had always dreamed of making a difference in the
            world by creating a unique online platform. With a burning desire to
            connect people, Anuj embarked on an exciting journey to start their
            own website. With a clear vision in mind, Anuj spent countless hours
            brainstorming ideas, researching industry trends, and outlining the
            core purpose of the website. The goal was to build a platform that
            would empower users to explore their passions for selfies, connect
            with like-minded individuals, and exchange selfies. Along the way,
            there were hurdles to overcome. Technical issues, resource
            constraints, and the ever-evolving nature of the digital landscape
            tested their perseverance. However, fueled by their unwavering
            commitment and the belief in their vision, they tackled each
            obstacle head-on, learning and growing with every setback. And so,
            the story of the website continues, with new chapters being written
            every day as the community grows, evolves, and leaves an indelible
            mark on the digital landscape.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
