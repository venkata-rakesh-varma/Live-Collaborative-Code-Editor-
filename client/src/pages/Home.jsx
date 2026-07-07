import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-white relative px-4 overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-60" />

      {/* Radial top glow */}
      <div className="absolute inset-0 radial-glow pointer-events-none" />

      {/* Ambient orbs */}
      <div
        className="absolute pointer-events-none rounded-full blur-[140px]"
        style={{
          width: 600,
          height: 600,
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full blur-[100px]"
        style={{
          width: 300,
          height: 300,
          top: "15%",
          right: "15%",
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full blur-[100px]"
        style={{
          width: 250,
          height: 250,
          bottom: "15%",
          left: "12%",
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Top-right Auth Pill */}
      <div className="absolute top-6 right-8 z-20 animate-fade-in">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-full"
          style={{
            background: "rgba(15, 21, 38, 0.8)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--border-default)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {user ? (
            <>
              <div className="avatar-bubble" style={{ width: 28, height: 28, fontSize: 10 }}>
                {user.username.slice(0, 2)}
              </div>
              <span style={{ color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}>
                <span style={{ color: "var(--text-accent)", fontWeight: 600 }}>{user.username}</span>
              </span>
              <div style={{ width: 1, height: 14, background: "var(--border-default)" }} />
              <button
                onClick={logout}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#f87171",
                  padding: "2px 8px",
                  borderRadius: 8,
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ fontSize: 13, fontWeight: 600, color: "var(--text-accent)", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a5b4fc")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-accent)")}
              >
                Login
              </Link>
              <div style={{ width: 1, height: 14, background: "var(--border-default)" }} />
              <Link
                to="/register"
                className="btn-primary"
                style={{ padding: "4px 14px", fontSize: 12, borderRadius: 8, boxShadow: "none" }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Hero Content */}
      <div className="text-center max-w-3xl relative z-10 animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full"
          style={{
            background: "rgba(99, 102, 241, 0.08)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
          }}
        >
          <span className="ping-dot" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#818cf8", letterSpacing: "0.06em" }}>
            REAL-TIME COLLABORATIVE CODING
          </span>
        </div>

        <h1
          className="brand-gradient"
          style={{
            fontSize: "clamp(42px, 8vw, 72px)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 24,
          }}
        >
          Collaborative<br />Code Editor
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 18,
            lineHeight: 1.7,
            maxWidth: 480,
            margin: "0 auto 48px",
          }}
        >
          Create a room and start coding together in real-time, with instant compilation and live chat.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/create-room" className="btn-primary" style={{ padding: "14px 32px", fontSize: 15 }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Room
          </Link>

          <Link to="/join-room" className="btn-ghost" style={{ padding: "14px 32px", fontSize: 15 }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Join Room
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-3 justify-center mt-14">
          {[
            { icon: "⚡", text: "Instant Compilation" },
            { icon: "💬", text: "Live Chat" },
            { icon: "🌐", text: "Multi-Language" },
            { icon: "🔒", text: "Secure Rooms" },
          ].map((f) => (
            <div
              key={f.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-subtle)",
                fontSize: 12,
                color: "var(--text-secondary)",
                fontWeight: 500,
              }}
            >
              <span>{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;