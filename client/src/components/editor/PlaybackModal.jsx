import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import api from "../../services/api";

const PlaybackModal = ({ roomId, onClose }) => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // multiplier
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentCode, setCurrentCode] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("javascript");
  const [activeUsers, setActiveUsers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const timerRef = useRef(null);

  // Fetch events on mount
  useEffect(() => {
    const fetchRecording = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/recordings/${roomId}`);
        const sortedEvents = (res.data.events || []).sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setEvents(sortedEvents);
        if (sortedEvents.length > 0) {
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Error loading recording:", err);
        setError("Failed to load recording session. Make sure someone has typed or joined.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecording();
  }, [roomId]);

  // Compute state based on the current event index
  useEffect(() => {
    if (currentIndex < 0 || events.length === 0) return;

    let code = "";
    let lang = "javascript";
    const users = new Set();
    const chats = [];

    // Replay all events up to the selected index
    for (let i = 0; i <= currentIndex; i++) {
      const ev = events[i];
      if (ev.type === "join-room") {
        users.add(ev.user);
      } else if (ev.type === "leave-room") {
        users.delete(ev.user);
      } else if (ev.type === "code-change" && ev.payload?.code !== undefined) {
        code = ev.payload.code;
      } else if (ev.type === "language-change" && ev.payload?.language) {
        lang = ev.payload.language;
      } else if (ev.type === "chat-message" && ev.payload?.message) {
        chats.push({
          username: ev.user,
          message: ev.payload.message,
          timestamp: ev.timestamp,
        });
      }
    }

    setCurrentCode(code);
    setCurrentLanguage(lang);
    setActiveUsers(Array.from(users));
    setChatMessages(chats);
  }, [currentIndex, events]);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const playNext = () => {
      setCurrentIndex((prev) => {
        if (prev >= events.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    };

    // Calculate delay based on time difference, capped at 2s max for better UX
    let delay = 1000 / playbackSpeed;
    if (currentIndex >= 0 && currentIndex < events.length - 1) {
      const current = new Date(events[currentIndex].timestamp);
      const next = new Date(events[currentIndex + 1].timestamp);
      const diff = Math.max(200, next - current); // min 200ms delay
      delay = Math.min(2500, diff) / playbackSpeed; // cap at 2.5s max
    }

    timerRef.current = setTimeout(playNext, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, events, playbackSpeed]);

  const handleSliderChange = (e) => {
    setIsPlaying(false);
    setCurrentIndex(Number(e.target.value));
  };

  const getEventDescription = (ev) => {
    if (!ev) return "";
    switch (ev.type) {
      case "join-room":
        return `👤 ${ev.user} joined the room`;
      case "leave-room":
        return `🚪 ${ev.user} left the room`;
      case "code-change":
        return `💻 ${ev.user} edited code`;
      case "language-change":
        return `🌐 ${ev.user} changed language to ${ev.payload?.language}`;
      case "chat-message":
        return `💬 ${ev.user}: "${ev.payload?.message}"`;
      default:
        return `${ev.user} triggered ${ev.type}`;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(5, 8, 16, 0.9)",
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        padding: 24,
        color: "var(--text-primary)",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>📽️</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Session Recording Playback
            </h2>
            <span
              style={{
                fontSize: 11,
                padding: "2px 8px",
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                borderRadius: 9999,
                color: "#818cf8",
                fontWeight: 600,
              }}
            >
              Room ID: {roomId.slice(0, 8)}...
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            Replay keystrokes, messages, and events from this coding session
          </p>
        </div>

        <button
          onClick={onClose}
          className="btn-ghost"
          style={{
            padding: "8px 16px",
            fontSize: 13,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Exit Playback
        </button>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <span style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#8b5cf6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>Fetching recording session data...</span>
        </div>
      ) : error ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: 36 }}>📂</span>
          <span style={{ color: "#f87171", fontSize: 14, fontWeight: 500 }}>{error}</span>
          <button onClick={onClose} className="btn-primary" style={{ padding: "10px 20px" }}>Back to Workspace</button>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", gap: 20, minHeight: 0 }}>
          {/* Left Main Replayer Panel */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0a0d16", border: "1px solid var(--border-subtle)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", background: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>
                Main.java / script.py (Playback Mode: {currentLanguage})
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Event {currentIndex + 1} of {events.length}
              </span>
            </div>
            <div style={{ flex: 1, position: "relative" }}>
              <Editor
                height="100%"
                language={currentLanguage}
                value={currentCode}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', Consolas, monospace",
                  minimap: { enabled: false },
                  scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                }}
              />
            </div>
          </div>

          {/* Right Sidebar Events & Metadata Panel */}
          <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
            {/* Active Users at this snapshot */}
            <div className="card" style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Active Users (Snapshot)
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {activeUsers.length === 0 ? (
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>No active users</span>
                ) : (
                  activeUsers.map((u, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "4px 10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {u}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Event Logs Timeline */}
            <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, padding: "16px 18px" }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 12 }}>
                Event Log Timeline
              </h3>
              <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                {events.map((ev, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentIndex(i);
                    }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                      background: i === currentIndex ? "rgba(99, 102, 241, 0.15)" : "transparent",
                      border: `1px solid ${i === currentIndex ? "rgba(99, 102, 241, 0.3)" : "transparent"}`,
                      color: i <= currentIndex ? "var(--text-primary)" : "var(--text-muted)",
                      transition: "all 0.2s",
                    }}
                  >
                    <p style={{ fontWeight: i === currentIndex ? 600 : 400, wordBreak: "break-word" }}>
                      {getEventDescription(ev)}
                    </p>
                    <span style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2, display: "block" }}>
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Timeline Controls */}
      {!loading && !error && events.length > 0 && (
        <div
          style={{
            marginTop: 20,
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            borderRadius: 16,
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            flexShrink: 0,
          }}
        >
          {/* Slider */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>0:00</span>
            <input
              type="range"
              min="0"
              max={events.length - 1}
              value={currentIndex}
              onChange={handleSliderChange}
              style={{
                flex: 1,
                accentColor: "#8b5cf6",
                cursor: "pointer",
              }}
            />
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
              {events.length} events
            </span>
          </div>

          {/* Controls Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* Left Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentIndex((c) => Math.max(0, c - 1));
                }}
                disabled={currentIndex === 0}
                className="btn-ghost"
                style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12 }}
              >
                ◀ Step
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn-primary"
                style={{
                  padding: "8px 20px",
                  fontSize: 13,
                  borderRadius: 10,
                  background: isPlaying ? "#ea580c" : undefined,
                  boxShadow: isPlaying ? "none" : undefined,
                }}
              >
                {isPlaying ? "⏸ Pause" : "▶ Play Session"}
              </button>

              <button
                onClick={() => {
                  setCurrentIndex((c) => Math.min(events.length - 1, c + 1));
                }}
                disabled={currentIndex === events.length - 1}
                className="btn-ghost"
                style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12 }}
              >
                Step ▶
              </button>
            </div>

            {/* Event Desc at Current Index */}
            <div style={{ flex: 1, textAlign: "center", margin: "0 20px", color: "var(--text-secondary)", fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {getEventDescription(events[currentIndex])}
            </div>

            {/* Playback Speed */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Speed</span>
              <div className="toolbar-select-wrapper">
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="select-field"
                  style={{ padding: "4px 30px 4px 10px", fontSize: 12, minWidth: 80, borderRadius: 8 }}
                >
                  <option value="0.5">0.5x</option>
                  <option value="1">1.0x</option>
                  <option value="2">2.0x</option>
                  <option value="5">5.0x</option>
                  <option value="10">10x</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PlaybackModal;
