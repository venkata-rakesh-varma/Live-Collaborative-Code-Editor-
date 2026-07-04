import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, value, onChange }) => {
  return (
    <Editor
      height="80vh"
      language={language}
      value={value}
      theme="vs-dark"
      onChange={onChange}
    />
  );
};

export default CodeEditor;