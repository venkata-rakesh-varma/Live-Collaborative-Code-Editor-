import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }
    navigate(`/editor/${roomId.trim()}`);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-50" />
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <div
        className="absolute rounded-full blur-[120px] pointer-events-none"
        style={{ width: 380, height: 380, top: "20%", left: "10%", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)" }}
      />
      <div
        className="absolute rounded-full blur-[120px] pointer-events-none"
        style={{ width: 380, height: 380, bottom: "15%", right: "10%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)" }}
      />

      <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 440, padding: "40px 36px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-muted)",
              marginBottom: 24,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🔗
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Join a Room
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                Enter an invite code to collaborate
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-box" style={{ marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
              Room ID / Invite Code
            </label>
            <input
              type="text"
              className="input-plain"
              placeholder="e.g. 242f6410-f56c-4c6c-9312-12c1c15b..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && joinRoom()}
              style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13 }}
            />
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
              Ask the room creator for the unique invite code
            </p>
          </div>

          <button
            onClick={joinRoom}
            className="btn-primary"
            style={{
              padding: "13px 20px",
              fontSize: 15,
              width: "100%",
              justifyContent: "center",
              background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
              boxShadow: "var(--shadow-button-emerald)",
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;