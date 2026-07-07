import { useState } from "react";

const Sidebar = ({ participants = [], roomId }) => {
  const [copied, setCopied] = useState(false);

  const copyInvite = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside
      style={{
        width: 220,
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flexShrink: 0,
        padding: "16px 12px",
        gap: 20,
      }}
    >
      {/* Room Info Block */}
      <div>
        <p className="section-label" style={{ marginBottom: 10 }}>Room Info</p>
        <div
          style={{
            background: "rgba(99, 102, 241, 0.06)",
            border: "1px solid rgba(99, 102, 241, 0.15)",
            borderRadius: 12,
            padding: "12px 14px",
          }}
        >
          <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6, letterSpacing: "0.04em" }}>
            INVITE CODE
          </p>
          <p
            style={{
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              color: "var(--text-accent)",
              wordBreak: "break-all",
              lineHeight: 1.6,
              marginBottom: 10,
              userSelect: "all",
            }}
          >
            {roomId}
          </p>
          <button
            onClick={copyInvite}
            style={{
              width: "100%",
              padding: "6px 0",
              background: copied ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${copied ? "rgba(16, 185, 129, 0.25)" : "var(--border-default)"}`,
              borderRadius: 8,
              color: copied ? "#34d399" : "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {copied ? (
              <>
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Users */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <p className="section-label">Active Users</p>
          <div
            style={{
              padding: "2px 8px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: 9999,
              fontSize: 10,
              fontWeight: 700,
              color: "#34d399",
            }}
          >
            {participants.length}
          </div>
        </div>

        <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
          {participants.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)", fontSize: 12 }}>
              No users yet
            </div>
          ) : (
            participants.map((p, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-subtle)",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: `hsl(${((p.username || "").charCodeAt(0) || 0) * 40 % 360}, 60%, 55%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "white",
                    textTransform: "uppercase",
                  }}
                >
                  {(p.username || "G").slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.username || "Guest"}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <span className="ping-dot" style={{ width: 5, height: 5, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: "#34d399" }}>Active</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;