import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, QueryClient } from "@tanstack/react-query";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { makeRequest } from "../../axios";
import AddHeader from "../../Components/AddHeader";
import BottomTabs from "../../Components/BottomTabs";
import SuccessPopup from "../../Components/SuccessPopup";
import image from "../../Icons/image.png";
import "./CreateGuessPage.scss";

const CreateGuessPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSelfie, setIsSelfie] = useState(false);
  const [title, setTitle] = useState("");
  const [hint, setHint] = useState("");
  const fileInputRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const queryClient = new QueryClient();

  const { t } = useTranslation();

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const lowercaseValue = e.target.value.toLowerCase();
    setTitle(lowercaseValue);
  };

  const handleInputChange2 = (e) => {
    const lowercaseValue2 = e.target.value.toLowerCase();
    setHint(lowercaseValue2);
  };

  useEffect(() => {
    try {
      const loadModel = async () => {
        const model = await blazeface.load();
        const image = new Image();
        image.src = selectedImage;

        image.onload = async () => {
          const predictions = await model.estimateFaces(image);

          if (predictions.length > 0) {
            setIsSelfie(true);
          } else {
            setIsSelfie(false);
          }
        };
      };

      if (selectedImage) {
        loadModel();
      }
    } catch (err) {
      console.log("Error occured recognising face", err);
    }
  }, [selectedImage]);

  const handleBack = () => {
    navigate("/guess");
  };

  //! Mutation
  const mutation = useMutation(
    (newGuess) => {
      return makeRequest.post("/guesses", newGuess);
    },
    {
      onSuccess: () => {
        //! Invalidate and refetch
        queryClient.invalidateQueries("guesses");
      },
    }
  );

  //! Upload
  const done = async () => {
    try {
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);
      formData.append("upload_preset", "Post-image");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dzooaaubg/image/upload",
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      let imgUrl = "";
      if (selectedImage) imgUrl = await done();
      mutation.mutate({ img: imgUrl, title: title, hint: hint });
      setShowPopup(true);
      navigate("/guess");
    } catch (error) {
      console.error("Error creating selpost:", error);
    }
  };

  return (
    <div className="create-guess-page">
      <div className="mobile-create-page">
        <AddHeader title="Create" onBack={handleBack} />
        <div className="image-upload-container">
          <label htmlFor="file-input">
            <img
              src={image}
              alt="gallery"
              className="gallery-icon"
              style={{ zIndex: 2, cursor: "pointer" }}
            />
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          {selectedImage && (
            <div className="mobile-selected-image">
              <img src={selectedImage} alt="Uploaded" className="select" />
              {isSelfie && (
                <p style={{ color: "#03c988" }}>
                  {t("CreateSelpost.selfieRecognizable")}
                </p>
              )}
              {!isSelfie && (
                <p style={{ color: "#ff6969" }}>
                  {t("CreateSelpost.selfieNotRecognizable")}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="others">
          <input
            type="text"
            placeholder="Enter title of selfie"
            value={title}
            onChange={handleInputChange}
          />
          <strong>{t("CreateGuess.hint")}</strong>
          <div className="hint">
            <input
              type="text"
              placeholder="Enter here"
              value={hint}
              onChange={handleInputChange2}
            />
            <button
              disabled={!(hint && title && isSelfie)}
              className={
                !(hint && title && isSelfie) ? "disable-done" : "enable-done"
              }
              onClick={handleUpload}
            >
              {t("CreateGuess.done")}
            </button>
            {showPopup && (
              <SuccessPopup
                message={t("CreateGuess.popupMessage")}
                onClose={handleClosePopup}
              />
            )}
          </div>{" "}
        </div>
        <BottomTabs />
      </div>
      <div className="desktop-create-page"></div>
    </div>
  );
};

export default CreateGuessPage;
