import React, { useState, useRef, useEffect, useContext } from "react";
import ReactGA from "react-ga";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";
import "./FaceRecognition.scss";
import choose from "../Icons/image.png";
import Compressor from "compressorjs";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { AuthContext } from "../Context/authContext";
import { makeRequest } from "../axios";
import SuccessPopup from "./SuccessPopup";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "axios";

const FaceRecognition = () => {
  const [isSelfie, setIsSelfie] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [category, setCategory] = useState("");
  const [secretMsg, setSecretMsg] = useState("");
  const [receiver, setReceiver] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [audioBlob, setAudioBlob] = useState();

  const { currentUser } = useContext(AuthContext);
  const { t } = useTranslation();

  //! Image upload
  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  //! File change and Image compression
  const handleFileChange = (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const compressor = new Compressor(file, {
          quality: 0.6,
          success: (compressedResult) => {
            const compressedFile = new File([compressedResult], file.name, {
              type: compressedResult.type,
              lastModified: Date.now(),
            });

            setSelectedImage(URL.createObjectURL(compressedFile));
          },
          error: (err) => {
            console.error("Image compression error:", err);
          },
        });
      }
    } catch (err) {
      console.log("Error occured selecting new file in add page", err);
    }
  };

  //! Query
  const queryClient = new QueryClient();

  //! Mutation
  const mutation = useMutation(
    (newSelpost) => {
      return makeRequest.post("/selposts", newSelpost);
    },
    {
      onSuccess: () => {
        //! Invalidate and refetch
        queryClient.invalidateQueries("selposts");
      },
    }
  );

  //! Blazeface
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

  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err)
  );

  const addAudioElement = (blob) => {
    try {
      const url = URL.createObjectURL(blob);
      setAudioBlob(blob);
      const audio = document.createElement("audio");
      audio.src = url;
      audio.controls = true;
      // document.body.appendChild(audio);
    } catch (err) {
      console.log("Error creating audio in valid format", err);
    }
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);
      formData.append("upload_preset", "Post-image");
      const userName = currentUser["user"].username;

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);

      const publicId = `${userName}_selpost/image_${timestamp}_${randomString}`;

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dzooaaubg/image/upload",
        formData,
        {
          params: {
            public_id: publicId,
          },
        }
      );
      return res.data.secure_url;
    } catch (err) {
      console.log("Error uploading selpost to storage", err);
    }
  };

  const audioUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob);
      formData.append("upload_preset", "Post-audio");

      const userName = currentUser["user"].username;

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);

      const publicId = `${userName}_audio/audio_${timestamp}_${randomString}`;

      const secondres = await axios.post(
        "https://api.cloudinary.com/v1_1/dzooaaubg/raw/upload",
        formData,
        {
          params: {
            public_id: publicId,
          },
        }
      );

      return secondres.data.secure_url;
    } catch (err) {
      console.log("Error uploading audio to storage", err);
    }
  };

  //! Selpost upload
  const handleSelpost = async () => {
    try {
      let imgUrl = "";
      let audioUrl = "";
      if (selectedImage) imgUrl = await upload();
      if (audioBlob) audioUrl = await audioUpload();
      mutation.mutate({
        category: category === "None" ? "None" : category,
        img: imgUrl,
        audioMsg: audioUrl,
        secretMsg,
        receiver,
      });
    } catch (error) {
      console.error("Error creating selpost:", error);
    }
  };

  //! Alerts
  const handleAlertClick = () => {
    toast.success(t("SelpostUpload.success"), {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  //! Handle two clicks
  const handleTwoClicks = () => {
    try {
      handleSelpost();
      handleAlertClick();
    } catch (err) {
      console.log("Error occured uploading your selpost", err);
    }
  };

  return (
    <div>
      <div className="mobile-upload">
        <div className="select-container">
          <img src={choose} alt="Upload Icon" onClick={handleImageUpload} />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          {selectedImage && (
            <div className="selected-image">
              <img src={selectedImage} alt="Uploaded" />
              {isSelfie && (
                <p className="processing-success">
                  {t("CreateSelpost.selfieRecognizable")}
                </p>
              )}
              {!isSelfie && (
                <p className="processing">
                  {t("CreateSelpost.selfieNotRecognizable")}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="selpost-inputs">
          <input
            type="text"
            placeholder={t("CreateSelpost.selfieCategory")}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="text"
            placeholder={t("CreateSelpost.selfieSecretMsg")}
            onChange={(e) => setSecretMsg(e.target.value)}
          />
          <input
            type="text"
            placeholder={t("CreateSelpost.receiver")}
            onChange={(e) => setReceiver(e.target.value.toLowerCase())}
          />
          <div className="btn-and-text">
            <button
              onClick={() => {
                ReactGA.event({
                  category: "Button",
                  action: "Click",
                  label: "Selpost Button",
                });
                handleTwoClicks();
              }}
              disabled={!isSelfie}
              className={!isSelfie ? "disable-button" : "enable-button"}
            >
              Selpost
            </button>
          </div>
          <AudioRecorder
            onRecordingComplete={(blob) => addAudioElement(blob)}
            recorderControls={recorderControls}
            // downloadOnSavePress={true}
            // downloadFileExtension="mp3"
            showVisualizer={true}
            onClick={ReactGA.event({
              category: "Icon",
              action: "Click",
              label: "Audio Icon",
            })}
          />
        </div>
        <ToastContainer />
      </div>

      <div className="desktop-upload">
        <div className="desktop-select-container">
          <img src={choose} alt="Upload icon" onClick={handleImageUpload} />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          {selectedImage && (
            <div className="desktop-selected-image">
              <img src={selectedImage} alt="Uploaded" />
              {isSelfie && <p>Selfie recognized!</p>}
              {!isSelfie && <p>Processing your selfie...</p>}
            </div>
          )}
        </div>
        <div className="desktop-selpost-inputs">
          <input
            type="text"
            placeholder="Category of type of selfie"
            onChange={(e) => setCategory(e.target.value)}
          />
          <textarea
            type="text"
            placeholder="Type your Secret message here..."
            onChange={(e) => setSecretMsg(e.target.value)}
          />
          <textarea
            type="text"
            placeholder="Username to whom &#10;you want to show the secret message"
            onChange={(e) => setReceiver(e.target.value)}
          />
        </div>
        <div className="btn-and-text">
          <span>Optional</span>
          <button
            disabled={!isSelfie}
            className={!isSelfie ? "disable-button" : "enable-button"}
            onClick={() => {
              ReactGA.event({
                category: "Button",
                action: "Click",
                label: "Desktop Selpost Button",
              });
              handleTwoClicks();
            }}
          >
            Selpost
          </button>
          <AudioRecorder
            onRecordingComplete={(blob) => addAudioElement(blob)}
            recorderControls={recorderControls}
            // downloadOnSavePress={true}
            // downloadFileExtension="mp3"
            showVisualizer={true}
            onClick={ReactGA.event({
              category: "Icon",
              action: "Click",
              label: "Audio Icon",
            })}
          />
          {showAlert && (
            <SuccessPopup
              message="Selpost uploaded successfully!"
              onClose={handleAlertClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
