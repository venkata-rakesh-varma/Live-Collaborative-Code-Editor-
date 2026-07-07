import { useParams, useBlocker, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { executeCode } from "../services/compiler";
import api from "../services/api";
import { toast } from "react-hot-toast";

import CodeEditor from "../components/editor/CodeEditor";
import EditorToolbar from "../components/editor/EditorToolbar";
import OutputConsole from "../components/output/OutputConsole";
import ChatBox from "../components/chat/ChatBox";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import PlaybackModal from "../components/editor/PlaybackModal";

import useEditor from "../hooks/useEditor";
import useSocketEvents from "../hooks/useSocket";

const EditorPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Navigation guard: browser tab close / page refresh ───────────────────
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // ── Navigation guard: in-app routing (requires data router in App.jsx) ────
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    const ok = window.confirm(
      "Are you sure you want to leave the room? Your active session will be disconnected."
    );
    if (ok) blocker.proceed();
    else blocker.reset();
  }, [blocker]);

  // ── State ─────────────────────────────────────────────────────────────────
  const [roomTitle,     setRoomTitle]    = useState("CodeSync Room");
  const [participants,  setParticipants] = useState([]);
  const [isRunning,     setIsRunning]    = useState(false);
  const [exitCode,      setExitCode]     = useState(null);
  const [collaborators, setCollaborators] = useState({});
  const [showPlayback,  setShowPlayback]  = useState(false);

  // ── Editor hook ───────────────────────────────────────────────────────────
  const {
    code,
    language,
    output,
    updateCode,
    setLanguage,
    setCodeOnly,
    setOutput,
    setLanguageState,
  } = useEditor();

  // ── Socket (returns the socket instance and registers event handlers) ─────
  const socket = useSocketEvents({
    "code-update":     (newCode)  => updateCode(newCode),
    "language-update": (newLang)  => {
      setCodeOnly(code);
      if (typeof setLanguageState === "function") setLanguageState(newLang);
      else setLanguage(newLang);
    },
  });

  // ── Username ──────────────────────────────────────────────────────────────
  const [guestUsername] = useState(() => {
    if (user?.username) return user.username;
    const saved = sessionStorage.getItem("guestUsername");
    if (saved) return saved;
    const generated = `Guest_${Math.floor(1000 + Math.random() * 9000)}`;
    sessionStorage.setItem("guestUsername", generated);
    return generated;
  });

  const username = user?.username || guestUsername;

  // ── Fetch room info on load ───────────────────────────────────────────────
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${roomId}`);
        setRoomTitle(res.data.title || "CodeSync Room");
        const dbParticipants = res.data.participants || [];
        if (username && !dbParticipants.some((p) => p.username === username)) {
          dbParticipants.push({ username });
        }
        setParticipants(dbParticipants);
      } catch (err) {
        console.error("Error fetching room details:", err);
      }
    };
    fetchRoom();
  }, [roomId, username]);

  // ── Join / leave socket room ──────────────────────────────────────────────
  // The leave-room emit is deferred by 500 ms so that React StrictMode's
  // fake-unmount / Vite HMR remounts can cancel it before it fires.
  // A genuine navigation always takes longer than 500 ms.
  const leaveTimerRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Cancel any leave-room that was scheduled by the previous cleanup
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    if (!socket.connected) socket.connect();
    socket.emit("join-room", { roomId, username });

    return () => {
      leaveTimerRef.current = setTimeout(() => {
        socket.emit("leave-room", { roomId, username });
        leaveTimerRef.current = null;
      }, 500);
    };
  }, [socket, roomId, username]);

  // ── Real-time participant list & cursor updates ───────────────────────────
  useEffect(() => {
    if (!socket) return;

    const onRoomUsersUpdate = (activeUsers) => setParticipants(activeUsers);

    const onCursorUpdate = ({ socketId, username: colUser, cursor }) => {
      if (colUser === username) return;
      setCollaborators((prev) => ({
        ...prev,
        [socketId]: {
          username: colUser,
          cursor,
          color: `hsl(${(colUser.charCodeAt(0) * 45) % 360}, 75%, 60%)`,
        },
      }));
    };

    const onUserJoined = ({ username: joined }) => {
      if (joined && joined !== username) {
        toast.success(`${joined} joined the room!`, { icon: "👋" });
      }
    };

    const onUserLeft = ({ socketId, username: leaving }) => {
      if (leaving && leaving !== username) {
        toast.error(`${leaving} left the room.`, { icon: "🚪" });
      }
      setCollaborators((prev) => {
        const copy = { ...prev };
        delete copy[socketId];
        return copy;
      });
    };

    socket.on("room-users-update", onRoomUsersUpdate);
    socket.on("cursor-update",     onCursorUpdate);
    socket.on("user-joined",       onUserJoined);
    socket.on("user-left",         onUserLeft);

    return () => {
      socket.off("room-users-update", onRoomUsersUpdate);
      socket.off("cursor-update",     onCursorUpdate);
      socket.off("user-joined",       onUserJoined);
      socket.off("user-left",         onUserLeft);
    };
  }, [socket, username]);

  // ── Editor event handlers ─────────────────────────────────────────────────
  const handleCodeChange = (value) => {
    updateCode(value);
    socket?.emit("code-change", { roomId, code: value });
  };

  const handleCursorChange = (cursor) => {
    socket?.emit("cursor-change", { roomId, cursor });
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    socket?.emit("language-change", { roomId, language: newLang });
  };

  // ── Run code via Piston proxy ─────────────────────────────────────────────
  const handleRunCode = async () => {
    if (isRunning) return;
    try {
      setIsRunning(true);
      setExitCode(null);
      setOutput("⏳ Compiling and running...");

      const res = await executeCode({ language, source: code });

      if (res?.run) {
        const { output: out, stdout, stderr, exitCode: ec } = res.run;
        const display = out || stdout || "";
        const errors  = stderr || "";
        setExitCode(ec ?? 0);

        if (display) {
          setOutput(display + (errors && ec !== 0 ? `\n\n[stderr]\n${errors}` : ""));
        } else if (errors) {
          setOutput(`[Runtime Error]\n${errors}`);
        } else {
          setOutput("");
        }

        if (res.compile?.stderr) {
          setOutput(`[Compile Error]\n${res.compile.stderr}`);
          setExitCode(1);
        }
      } else {
        setOutput("");
      }
    } catch (err) {
      setOutput(`[Error]\n${err.message || String(err)}`);
      setExitCode(1);
    } finally {
      setIsRunning(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        overflow: "hidden",
      }}
    >
      <Navbar
        roomTitle={roomTitle}
        roomId={roomId}
        username={username}
        participants={participants}
        onOpenPlayback={() => setShowPlayback(true)}
        onLeave={() => navigate("/")}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar — participants & invite code */}
        <Sidebar participants={participants} roomId={roomId} />

        {/* Editor panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            background: "#0a0d16",
          }}
        >
          <EditorToolbar
            language={language}
            setLanguage={handleLanguageChange}
            runCode={handleRunCode}
            isRunning={isRunning}
          />
          <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
            <CodeEditor
              language={language}
              value={code}
              onChange={handleCodeChange}
              onCursorChange={handleCursorChange}
              collaborators={collaborators}
            />
          </div>
        </div>

        {/* Right panel — chat + output */}
        <div
          style={{
            width: 300,
            borderLeft: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-surface)",
            flexShrink: 0,
          }}
        >
          <ChatBox socket={socket} roomId={roomId} username={username} />
          <OutputConsole output={output} exitCode={exitCode} language={language} />
        </div>
      </div>

      {showPlayback && (
        <PlaybackModal roomId={roomId} onClose={() => setShowPlayback(false)} />
      )}
    </div>
  );
};

export default EditorPage;