import React, { useState, useEffect } from "react";
import { Peer } from "peerjs";

const Home = () => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [connection, setConnection] = useState(null);
  const [remoteId, setRemoteId] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const newPeer = new Peer();

    newPeer.on("open", (id) => {
      setPeerId(id);
    });

    newPeer.on("connection", (conn) => {
      setConnection(conn);
      conn.on("data", (data) => {
        setMessages((prev) => [...prev, { text: data, sender: "them" }]);
      });
    });

    setPeer(newPeer);

    return () => newPeer.destroy();
  }, []);

  const connectToPeer = () => {
    if (!peer || !remoteId) return;
    const conn = peer.connect(remoteId);

    conn.on("open", () => {
      setConnection(conn);
    });

    conn.on("data", (data) => {
      setMessages((prev) => [...prev, { text: data, sender: "them" }]);
    });
  };

  const sendMessage = () => {
    if (connection && message.trim()) {
      connection.send(message);
      setMessages((prev) => [...prev, { text: message, sender: "me" }]);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>P2P Chat with PeerJS</h2>

      <div style={{ marginBottom: "10px" }}>
        <p><strong>Your ID:</strong> {peerId}</p>
        <p>Share this ID with someone to connect.</p>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter peer ID"
          value={remoteId}
          onChange={(e) => setRemoteId(e.target.value)}
          style={{
            padding: "8px",
            marginRight: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
        <button
          onClick={connectToPeer}
          style={{
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Connect
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "250px",
          overflowY: "auto",
          marginBottom: "10px"
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "me" ? "right" : "left",
              marginBottom: "5px"
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px",
                borderRadius: "10px",
                backgroundColor: msg.sender === "me" ? "#007bff" : "#e0e0e0",
                color: msg.sender === "me" ? "white" : "black"
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {connection && (
        <div style={{ display: "flex" }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flex: "1",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "8px 12px",
              marginLeft: "8px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
