import api from "./api";

// Internal language key → display name (server handles the Judge0 ID mapping)
// These keys must match the LANGUAGE_IDS map in compilerController.js
export const SUPPORTED_LANGUAGES = {
  javascript: "JavaScript",
  python:     "Python",
  java:       "Java",
  cpp:        "C++",
};

/**
 * Execute source code via our backend, which proxies to Judge0 CE.
 * @param {string} language - one of: javascript, python, java, cpp
 * @param {string} source   - the source code string
 * @param {string} stdin    - optional stdin input
 * @returns {Object} result with run.output, run.stdout, run.stderr, status, time, memory
 */
export const executeCode = async ({ language, source, stdin = "" }) => {
  if (!SUPPORTED_LANGUAGES[language]) {
    throw new Error(`Unsupported language: ${language}`);
  }

  try {
    const response = await api.post("/compiler/execute", {
      language,
      source,
      stdin,
    });

    return response.data;
  } catch (error) {
    const serverMsg = error.response?.data?.message;
    throw new Error(serverMsg || error.message || "Code execution failed");
  }
};