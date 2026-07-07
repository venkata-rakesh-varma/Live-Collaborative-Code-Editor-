import { useState, useEffect, useRef } from "react";

const ChatBox = ({ socket, roomId, username }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    const handleIncomingMessage = (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    };
    socket.on("chat-message", handleIncomingMessage);
    return () => { socket.off("chat-message", handleIncomingMessage); };
  }, [socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    socket?.emit("chat-message", { roomId, message, username });
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <svg width="13" height="13" fill="none" stroke="rgba(148,163,184,0.7)" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase" }}>
          Live Chat
        </span>
      </div>

      {/* Messages */}
      <div
        className="custom-scrollbar"
        style={{ flex: 1, overflowY: "auto", padding: "12px 12px", display: "flex", flexDirection: "column", gap: 10 }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)", fontSize: 12 }}>
            No messages yet. Say hello! 👋
          </div>
        )}
        {messages.map((msg, index) => {
          const isMe = msg.username === username;
          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMe ? "flex-end" : "flex-start",
              }}
            >
              <span style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 3, paddingLeft: 2, paddingRight: 2, fontWeight: 500 }}>
                {msg.username}
              </span>
              <div className={isMe ? "chat-bubble-self" : "chat-bubble-other"}>
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "10px 12px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          gap: 8,
          flexShrink: 0,
          background: "var(--bg-card)",
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "8px 14px",
            background: "var(--bg-input)",
            border: "1px solid var(--border-default)",
            borderRadius: 10,
            color: "var(--text-primary)",
            fontSize: 13,
            outline: "none",
            fontFamily: "Inter, sans-serif",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-focus)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "0 14px",
            background: "var(--gradient-brand)",
            border: "none",
            borderRadius: 10,
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.2s, transform 0.15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;