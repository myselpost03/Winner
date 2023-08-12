import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { makeRequest } from "../../axios";
import AddHeader from "../../Components/AddHeader";
import NavBar from "../../Components/NavBar";
import BottomTabs from "../../Components/BottomTabs";
import "./CommentPage.scss";

const CommentPage = () => {
  const { id } = useParams();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const [desc, setDesc] = useState("");

  const { isLoading, error, data, refetch } = useQuery(
    ["comments", id],
    () => makeRequest.get("/comments?selpostId=" + id).then((res) => res.data),
    {
      enabled: id !== undefined,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 2592000000,
      cacheTime: 2592000000,
      manual: true,
    }
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setDesc(inputValue);
  };

  const handleClick = async (e) => {
    try {
      e.preventDefault();
      mutation.mutate({ desc, selpostId: id });
      setDesc("");
      refetch();
      queryClient.invalidateQueries(["comments"]);
    } catch (err) {
      console.log("Error sending a comment", err);
    }
  };

  const HandleBack = () => {
    navigate("/home");
  };

  return (
    <div className="comment-page">
      <div className="mobile-comment-page">
        <AddHeader title={t("Comment.comments")} onBack={HandleBack} />
        <BottomTabs />
        <div className="mobile-comment-box">
          <div className="mobile-write">
            <input
              type="text"
              placeholder={t("Comment.placeholder")}
              value={desc}
              onChange={handleInputChange}
              className="write"
            />
            <button
              disabled={!desc ? true : false}
              onClick={handleClick}
              className={!desc ? "btn-disable" : "btn-enable"}
            >
              {t("Comment.button")}
            </button>
          </div>
          {error
            ? "Something went wrong"
            : isLoading
            ? t("Loading.loading")
            : data.map((comment) => (
                <div className="mobile-comment" key={comment.id}>
                  <div className="mobile-info">
                    <img src={comment.profilePic} alt="profile pic" />
                    <div className="mobile-content">
                      <p>{comment.username}</p>
                      <p>{comment.desc}</p>
                    </div>
                    <div className="mobile-date">
                      <span>{moment(comment.createdAt).fromNow()}</span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <div className="desktop-comment-page">
        <NavBar />
        <div className="comment-box">
          <div className="write">
            <input
              type="text"
              placeholder="write a comment..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <button
              disabled={!desc ? true : false}
              onClick={handleClick}
              className={!desc ? "btn-disable" : "btn-enable"}
            >
              Comment
            </button>
          </div>
          {error
            ? "Something went wrong"
            : isLoading
            ? "loading"
            : data.map((comment) => (
                <div className="comment" key={comment.id}>
                  <div className="info">
                    <img src={comment.profilePic} alt="profile pic" />
                    <div className="content">
                      <p>{comment.username}</p>
                      <p>{comment.desc}</p>
                    </div>
                    <div className="date">
                      <span>{moment(comment.createdAt).fromNow()}</span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default CommentPage;
