import { useEffect, useState, useRef } from "react";
import { Peer } from "peerjs";

const GameLobby = () => {
    const [self, setSelf] = useState(null);
    const [selfId, setSelfId] = useState("");
    const [connection, setConnection] = useState(null);
    const [friendId, setFriendId] = useState("");
    const [status, setStatus] = useState("Waiting for connection...");
    const [messages, setMessages] = useState([]); // Stores chat messages
    const [messageInput, setMessageInput] = useState(""); // Tracks input field
    const connectionRef = useRef(null); // Track the latest connection

    useEffect(() => {
        const newSelfPeer = new Peer();

        newSelfPeer.on("open", (id) => {
            setSelfId(id);
        });

        newSelfPeer.on("connection", (conn) => {
            setConnection(conn);
            connectionRef.current = conn;
            setStatus("Connected to " + conn.peer);
            setupConnectionEvents(conn);
        });

        setSelf(newSelfPeer);

        return () => {
            if (connectionRef.current) {
                connectionRef.current.close();
            }
            newSelfPeer.destroy();
        };
    }, []);

    const setupConnectionEvents = (conn) => {
        conn.on("open", () => {
            console.log("Connection opened with:", conn.peer);
        });

        conn.on("data", (data) => {
            console.log("Received message:", data);
            setMessages((prevMessages) => [...prevMessages, { sender: "Friend", text: data }]);
        });

        conn.on("close", () => {
            setConnection(null);
            connectionRef.current = null;
            setStatus("Friend disconnected. You may connect to someone else.");
            setFriendId("");
        });
    };

    // Function to send a message
    const sendMessage = () => {
        if (connection && messageInput.trim()) {
            connection.send(messageInput); // Send message via PeerJS
            setMessages((prevMessages) => [...prevMessages, { sender: "You", text: messageInput }]); // Update UI
            setMessageInput(""); // Clear input field
        }
    };

    const connectToFriend = () => {
        if (!self || connection) return;

        try {
            const conn = self.connect(friendId);
            setConnection(conn);
            connectionRef.current = conn;
            setStatus("Connecting...");

            setupConnectionEvents(conn);
        } catch (error) {
            setStatus("Failed to connect. Please check the ID.");
            console.error("Connection error:", error);
        }
    };

    return (
        <div>
            <h2>Game Lobby</h2>
            <p>Your ID: <strong>{selfId || "Generating..."}</strong></p>
            <p>Status: {status}</p>

            {!connection && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter friend's ID"
                        value={friendId}
                        onChange={(e) => setFriendId(e.target.value)}
                    />
                    <button onClick={connectToFriend} disabled={!friendId}>Connect</button>
                </div>
            )}

            {connection && (
                <div>
                    <h3>Chat</h3>
                    <div style={{ border: "1px solid #ccc", padding: "10px", height: "200px", overflowY: "auto" }}>
                        {messages.map((msg, index) => (
                            <p key={index}><strong>{msg.sender}:</strong> {msg.text}</p>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button onClick={sendMessage} disabled={!messageInput.trim()}>Send</button>
                </div>
            )}
        </div>
    );
};

export default GameLobby;
