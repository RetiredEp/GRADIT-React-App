import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import queryString from "query-string";
import io from "socket.io-client";

import "./Chat.css";

let socket;

const Chat = () => {
  const location = useLocation(); // Get location using useLocation hook
  const [name, setName] = useState(""); // Create a state variable to store the name
  const [room, setRoom] = useState(""); // Create a state variable to store the room
  const [message, setMessage] = useState(""); // Create a state variable to store the message
  const [messages, setMessages] = useState([]); // Create a state variable to store the

  useEffect(() => {
    const { name, room } = queryString.parse(location.search); // Parse the search params

    socket = io("http://localhost:5000"); // Connect to the server

    setName(name); // Set the name
    setRoom(room); // Set the room

    socket.emit("join", { name, room }, ({error}) => {
      console.log("User joined");
    });

    return () => {
      socket.emit("left");
      socket.off();
    };
  }, [location]); // Add location to dependency array

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  // Function to send messages
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  console.log(messages, message);

  return (
    <div className="outerContainer">
      <div className="container">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => (event.key === "Enter") ? sendMessage(event) : null}
        />
      </div>
    </div>
  );
}

export default Chat;
