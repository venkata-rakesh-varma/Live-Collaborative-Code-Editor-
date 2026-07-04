const OutputConsole = ({ output }) => {
  return (
    <div className="bg-black text-green-400 p-3 h-60 overflow-auto">
      <pre>{output}</pre>
    </div>
  );
};

export default OutputConsole;