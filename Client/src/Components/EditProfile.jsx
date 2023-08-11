import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, QueryClient } from "@tanstack/react-query";
import "./EditProfile.scss";
import NavBar from "./NavBar";
import BottomTabs from "./BottomTabs";
import AddHeader from "./AddHeader";
import { AuthContext } from "../Context/authContext";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { makeRequest } from "../axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { currentUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target.result;
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / image.width;
          canvas.width = MAX_WIDTH;
          canvas.height = image.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, { type: file.type }));
            },
            file.type,
            0.6
          );
        };
        image.onerror = (error) => {
          reject(error);
        };
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file);
        const profileUrl = await upload(compressedFile);
        setProfile(profileUrl);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Post-image");

      const userName = currentUser["user"].username;

      const publicId = `${userName}/image`;

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dzooaaubg/image/upload`,
        formData,
        {
          params: {
            public_id: publicId,
          },
        }
      );
      return res.data.secure_url;
    } catch (err) {
      console.log(err);
    }
  };

  //! Query
  const queryClient = new QueryClient();

  //! Mutation
  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("user");
      },
      onError: (error) => {
        console.error("Error updating profile:", error);
      },
    }
  );

  const handleBack = () => {
    navigate(`/profile/${currentUser["user"].id}`);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setShowPopup(true);

    try {
      let profileUrl = "";

      if (profile) {
        profileUrl = await upload(profile);
      } else if (currentUser["user"].profilePic) {
        profileUrl = currentUser["user"].profilePic;
      }

      const updatedUser = {
        id: currentUser["user"].id,
        name,
        gender,
        about,
        location,
        education,
        profilePic: profileUrl,
        email,
      };

      mutation.mutate(updatedUser);
      toast.success(t("EditProfile.updated"), {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="edit-profile">
      <>
        <AddHeader
          title={t("EditProfile.title")}
          onBack={handleBack}
          className="header"
        />

        <div className="mobile-edit-profile">
          <BottomTabs />
          <div className="mobile-edit-container">
            <div className="mobile-inputs">
              <strong className="profile">{t("EditProfile.changePic")}</strong>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              <input
                type="text"
                placeholder={t("EditProfile.namePlaceholder")}
                name="name"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder={t("EditProfile.genderPlaceholder")}
                name="gender"
                onChange={(e) => setGender(e.target.value)}
              />

              <input
                type="text"
                placeholder={t("EditProfile.emailPlaceholder")}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder={t("EditProfile.locationPlaceholder")}
                name="location"
                onChange={(e) => setLocation(e.target.value)}
              />
              <input
                type="text"
                placeholder={t("EditProfile.educationPlaceholder")}
                name="education"
                onChange={(e) => setEducation(e.target.value)}
              />
              <textarea
                type="text"
                placeholder={t("EditProfile.aboutPlaceholder")}
              />
              <button onClick={handleClick}>{t("EditProfile.save")}</button>
            </div>
          </div>
          <ToastContainer />
        </div>
        <div className="desktop-edit-profile">
          <NavBar />
          <div className="edit-container">
            <div className="inputs">
              <strong className="profile">Change Profile</strong>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              <input
                type="text"
                placeholder="Name"
                name="name"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Gender"
                name="gender"
                onChange={(e) => setGender(e.target.value)}
              />

              <input
                type="text"
                placeholder="Location (optional)"
                onChange={(e) => setLocation(e.target.value)}
                name="location"
              />
              <input
                type="text"
                placeholder="Education (optional)"
                onChange={(e) => setEducation(e.target.value)}
                name="education"
              />
              <textarea
                type="text"
                placeholder="Write about yourself"
                onChange={(e) => setAbout(e.target.value)}
                name="about"
              />
              <button onClick={handleClick}>Save</button>
            </div>
          </div>
          <ToastContainer />
        </div>
      </>
    </div>
  );
};

export default EditProfile;
