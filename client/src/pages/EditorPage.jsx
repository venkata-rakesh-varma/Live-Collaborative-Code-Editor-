import { useParams } from "react-router-dom";
import { useEffect } from "react";

import CodeEditor from "../components/editor/CodeEditor";
import EditorToolbar from "../components/editor/EditorToolbar";
import OutputConsole from "../components/output/OutputConsole";
import ChatBox from "../components/chat/ChatBox";

import useEditor from "../hooks/useEditor";
import useSocketEvents from "../hooks/useSocket";

const EditorPage = () => {
  const { roomId } = useParams();

  const {
    code,
    language,
    output,
    updateCode,
    setLanguage,
  } = useEditor();

  const socket = useSocketEvents({
    "code-update": (newCode) => updateCode(newCode),
  });

  useEffect(() => {
    if (socket) {
      socket.emit("join-room", {
        roomId,
        username: "Guest",
      });
    }

    return () => {
      socket?.emit("leave-room", {
        roomId,
        username: "Guest",
      });
    };
  }, [socket, roomId]);

  const handleCodeChange = (value) => {
    updateCode(value);

    socket?.emit("code-change", {
      roomId,
      code: value,
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <EditorToolbar
        language={language}
        setLanguage={setLanguage}
        runCode={() => {}}
      />

      <div className="grid grid-cols-4 flex-1">
        <div className="col-span-3">
          <CodeEditor
            language={language}
            value={code}
            onChange={handleCodeChange}
          />
        </div>

        <div className="border-l flex flex-col">
          <ChatBox />
          <OutputConsole output={output} />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;