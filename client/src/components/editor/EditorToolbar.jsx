import Button from "../common/Button";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

const EditorToolbar = ({ language, setLanguage, runCode, isRunning }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: 50,
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border-subtle)",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {/* Language Selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase" }}>
          Language
        </span>
        <div className="toolbar-select-wrapper">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="select-field"
            style={{ padding: "6px 36px 6px 14px", fontSize: 13, minWidth: 140 }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Run Code Button */}
      <button
        onClick={runCode}
        disabled={isRunning}
        className="btn-primary"
        style={{
          padding: "7px 18px",
          fontSize: 13,
          borderRadius: 9,
          background: isRunning ? "rgba(99,102,241,0.4)" : undefined,
          boxShadow: isRunning ? "none" : undefined,
          cursor: isRunning ? "not-allowed" : "pointer",
        }}
      >
        {isRunning ? (
          <>
            <span style={{
              width: 13, height: 13,
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "white",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
              display: "inline-block",
              flexShrink: 0,
            }} />
            Running...
          </>
        ) : (
          <>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3l14 9-14 9V3z" fill="currentColor" />
            </svg>
            Run Code
          </>
        )}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default EditorToolbar;