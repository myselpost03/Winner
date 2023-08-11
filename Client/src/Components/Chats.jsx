import React from "react";
import Chat from "./Chat";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import LoadingSpinner from "./LoadingSpinner";
import "./Chats.scss";

function Chats() {
  const { isLoading, isError, data } = useQuery(
    ["userlist"],
    () =>
      makeRequest.get("/userlist/users").then((res) => {
        return res.data;
      })
  );

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading users</div>;
  }

  return (
    <div>
      {data.map((user) => (
        <Chat u={user} key={user.id} />
      ))}
    </div>
  );
}

export default Chats;
