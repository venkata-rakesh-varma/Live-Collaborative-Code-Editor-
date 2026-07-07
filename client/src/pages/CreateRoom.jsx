import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", icon: "🟨" },
  { value: "python", label: "Python", icon: "🐍" },
  { value: "java", label: "Java", icon: "☕" },
  { value: "cpp", label: "C++", icon: "⚙️" },
];

const CreateRoom = () => {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const createRoom = async () => {
    if (!title.trim()) {
      setError("Please enter a room title");
      return;
    }
    try {
      setError("");
      setLoading(true);
      const res = await api.post("/rooms", { title, language });
      navigate(`/editor/${res.data.room.roomId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedLang = LANGUAGES.find((l) => l.value === language);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-50" />
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <div
        className="absolute rounded-full blur-[120px] pointer-events-none"
        style={{ width: 380, height: 380, top: "20%", left: "10%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)" }}
      />
      <div
        className="absolute rounded-full blur-[120px] pointer-events-none"
        style={{ width: 380, height: 380, bottom: "15%", right: "10%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
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
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              ✨
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Create a Room
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                Set up your collaborative workspace
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
          {/* Room Title */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
              Room Title
            </label>
            <input
              type="text"
              className="input-plain"
              placeholder="My Awesome Project"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createRoom()}
            />
          </div>

          {/* Language */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
              Default Language
            </label>
            <div className="toolbar-select-wrapper" style={{ width: "100%" }}>
              <select
                className="select-field"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            {selectedLang && (
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <span>{selectedLang.icon}</span>
                Selected: {selectedLang.label}
              </p>
            )}
          </div>

          <button
            onClick={createRoom}
            disabled={loading}
            className="btn-primary"
            style={{ padding: "13px 20px", fontSize: 15, marginTop: 4, width: "100%", justifyContent: "center" }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                Creating room...
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Room
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CreateRoom;