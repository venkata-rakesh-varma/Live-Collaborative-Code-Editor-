import { Link } from "react-router-dom";

const Navbar = ({ roomTitle, roomId, username, participants = [], onOpenPlayback, onLeave }) => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: 56,
        background: "rgba(10, 14, 26, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "relative",
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* Left: Logo + Room Info */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <div className="logo-mark" style={{ width: 30, height: 30, fontSize: 11 }}>CS</div>
          <span
            className="brand-gradient"
            style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.03em" }}
          >
            CodeSync
          </span>
        </Link>

        {roomTitle && (
          <>
            <div className="divider" />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{roomTitle}</span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
                {roomId?.slice(0, 20)}...
              </span>
            </div>
          </>
        )}
      </div>

      {/* Right: Participants + User */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Playback Button */}
        {roomId && onOpenPlayback && (
          <button
            onClick={onOpenPlayback}
            className="btn-primary"
            style={{
              padding: "6px 12px",
              fontSize: 11,
              borderRadius: 8,
              boxShadow: "none",
              background: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 30,
            }}
          >
            📽️ Session Playback
          </button>
        )}

        {/* Leave Room Button */}
        {roomId && onLeave && (
          <button
            onClick={onLeave}
            className="btn-primary"
            style={{
              padding: "6px 12px",
              fontSize: 11,
              borderRadius: 8,
              boxShadow: "none",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 30,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
              e.currentTarget.style.border = "1px solid rgba(239, 68, 68, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
              e.currentTarget.style.border = "1px solid rgba(239, 68, 68, 0.3)";
            }}
          >
            🚪 Leave Room
          </button>
        )}

        {/* Avatar Stack */}
        {participants.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
              {participants.slice(0, 4).map((p, i) => (
                <div
                  key={i}
                  title={p.username || "Guest"}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "2px solid var(--bg-surface)",
                    background: `hsl(${((p.username || "").charCodeAt(0) || 0) * 40 % 360}, 60%, 55%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "white",
                    textTransform: "uppercase",
                    marginLeft: i === 0 ? 0 : -8,
                    zIndex: 4 - i,
                    position: "relative",
                  }}
                >
                  {(p.username || "G").slice(0, 2)}
                </div>
              ))}
              {participants.length > 4 && (
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  border: "2px solid var(--bg-surface)",
                  background: "var(--bg-raised)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: "var(--text-secondary)",
                  marginLeft: -8, zIndex: 0, position: "relative",
                }}>
                  +{participants.length - 4}
                </div>
              )}
            </div>
            <div className="badge-online">
              <span className="ping-dot" style={{ width: 5, height: 5 }} />
              {participants.length} online
            </div>
          </div>
        )}

        <div className="divider" />

        {/* Logged-in user */}
        {username && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: `hsl(${((username || "").charCodeAt(0) || 0) * 40 % 360}, 60%, 55%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "white", textTransform: "uppercase",
              }}
            >
              {(username || "G").slice(0, 2)}
            </div>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
              {username}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;