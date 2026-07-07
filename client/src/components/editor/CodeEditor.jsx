import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

const MONACO_LANGUAGE_MAP = {
  javascript: "javascript",
  python: "python",
  java: "java",
  cpp: "cpp",
};

const CodeEditor = ({ language, value, onChange, onCursorChange, collaborators = {} }) => {
  const monacoLang = MONACO_LANGUAGE_MAP[language] || language;
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Listen to cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange({
          lineNumber: e.position.lineNumber,
          column: e.position.column,
        });
      }
    });
  };

  // Dynamically inject stylesheet for custom collaborator cursor colors
  useEffect(() => {
    let styleEl = document.getElementById("monaco-collaborators-styles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "monaco-collaborators-styles";
      document.head.appendChild(styleEl);
    }

    let styles = "";
    Object.entries(collaborators).forEach(([socketId, data]) => {
      const color = data.color || "#8b5cf6";
      styles += `
        .collaborator-cursor-${socketId} {
          border-left: 2px solid ${color} !important;
          margin-left: -1px;
        }
        .collaborator-cursor-label-${socketId} {
          background-color: ${color} !important;
          color: white !important;
          font-size: 10px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          padding: 1px 4px;
          border-radius: 3px;
          position: absolute;
          top: -14px;
          left: 2px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 10;
        }
      `;
    });
    styleEl.innerHTML = styles;
  }, [collaborators]);

  // Apply collaborator cursor decorations
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const newDecorations = [];

    Object.entries(collaborators).forEach(([socketId, data]) => {
      if (!data.cursor) return;
      const { lineNumber, column } = data.cursor;

      newDecorations.push({
        range: new monacoRef.current.Range(lineNumber, column, lineNumber, column),
        options: {
          className: `collaborator-cursor-${socketId}`,
          hoverMessage: { value: data.username },
          after: {
            content: data.username,
            inlineClassName: `collaborator-cursor-label-${socketId}`,
          },
        },
      });
    });

    decorationsRef.current = editorRef.current.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [collaborators]);

  return (
    <Editor
      height="100%"
      language={monacoLang}
      value={value}
      theme="vs-dark"
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        fontLigatures: true,
        lineHeight: 22,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        wordWrap: "on",
        padding: { top: 16, bottom: 16 },
        renderLineHighlight: "gutter",
        bracketPairColorization: { enabled: true },
        formatOnPaste: true,
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        tabSize: 2,
        insertSpaces: true,
        scrollbar: {
          vertical: "visible",
          horizontal: "auto",
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
      }}
    />
  );
};

export default CodeEditor;