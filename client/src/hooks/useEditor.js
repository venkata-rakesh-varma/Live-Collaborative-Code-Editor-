import { useState, useCallback } from "react";

const DEFAULT_CODE = `// Welcome to CodeSync

function main() {
  console.log("Happy Coding!");
}

main();
`;

const useEditor = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");

  const updateCode = useCallback((value) => {
    setCode(value || "");
  }, []);

  const clearOutput = () => {
    setOutput("");
  };

  return {
    code,
    language,
    output,
    input,
    setCode,
    setLanguage,
    setOutput,
    setInput,
    updateCode,
    clearOutput,
  };
};

export default useEditor;