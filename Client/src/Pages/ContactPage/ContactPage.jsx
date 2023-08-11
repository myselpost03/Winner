import React from 'react'
import { useNavigate, Link } from "react-router-dom";
import AddHeader from "../../Components/AddHeader";
import "./ContactPage.scss";

const ContactPage = () => {
    const navigate = useNavigate();

    const handleBack = () => {
      navigate("/settings");
    };
  return (
    <div>
      
    </div>
  )
}

export default ContactPage
