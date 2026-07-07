const OutputConsole = ({ output, exitCode, language }) => {
  const isEmpty = !output || output.trim() === "";
  const isRunning = output === "⏳ Compiling and running...";
  const isError =
    !isRunning &&
    output &&
    (
      output.startsWith("[Error]") ||
      output.startsWith("[Runtime Error]") ||
      output.startsWith("[Compile Error]") ||
      output.startsWith("[Timeout]") ||
      output.startsWith("[stderr]") ||
      output.toLowerCase().includes("error") ||
      output.toLowerCase().includes("exception") ||
      (exitCode !== undefined && exitCode !== 0 && exitCode !== null)
    );

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#060810",
        minHeight: 0,
      }}
    >
      {/* Console Header */}
      <div
        style={{
          padding: "8px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
          background: "var(--bg-card)",
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase" }}>
          Output
        </span>

        {!isEmpty && (
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            {isRunning ? (
              <span style={{ fontSize: 10, color: "#fbbf24", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{
                  width: 8, height: 8,
                  border: "1.5px solid #fbbf24",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }} />
                Running
              </span>
            ) : (
              <>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: isError ? "#f87171" : "#34d399" }} />
                <span style={{ fontSize: 10, color: isError ? "#f87171" : "#34d399", fontWeight: 600 }}>
                  {isError ? "Error" : "Success"}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Output Area */}
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 18px",
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          fontSize: 12.5,
          lineHeight: 1.75,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          userSelect: "text",
        }}
      >
        {isEmpty ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, color: "var(--text-muted)" }}>
            <span style={{ color: "rgba(99,102,241,0.5)", fontSize: 12 }}>
              $ codesync run --local
            </span>
            <span style={{ fontStyle: "italic", fontSize: 11, lineHeight: 1.7 }}>
              No output yet. Select a language and hit{" "}
              <span style={{ color: "#818cf8", fontStyle: "normal", fontWeight: 600 }}>Run Code</span>{" "}
              to execute on your machine.
            </span>
          </div>
        ) : isRunning ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fbbf24" }}>
            <span style={{
              width: 12, height: 12,
              border: "2px solid #fbbf24",
              borderTopColor: "transparent",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.7s linear infinite",
            }} />
            <span>Compiling and running locally...</span>
          </div>
        ) : (
          <>
            {/* Prompt line */}
            <div style={{ color: "rgba(99,102,241,0.5)", marginBottom: 8, fontSize: 11 }}>
              $ {language || "code"} main{" "}
              {exitCode !== undefined && exitCode !== null && (
                <span style={{ color: exitCode === 0 ? "#34d399" : "#f87171" }}>
                  (exit {exitCode})
                </span>
              )}
            </div>

            {/* Output content */}
            <span style={{ color: isError ? "#f87171" : "#4ade80" }}>
              {output}
            </span>

            {/* Empty output indicator */}
            {!isError && output.trim() === "" && (
              <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: 11 }}>
                ✓ Program exited with no output.
              </span>
            )}
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default OutputConsole;