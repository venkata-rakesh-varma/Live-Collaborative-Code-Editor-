import Button from "../common/Button";

const EditorToolbar = ({ language, setLanguage, runCode }) => {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-900">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
      </select>

      <Button onClick={runCode}>Run</Button>
    </div>
  );
};

export default EditorToolbar;