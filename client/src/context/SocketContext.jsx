import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// ── URL resolution ──────────────────────────────────────────────────────────
const getSocketURL = () => {
  const envUrl = import.meta.env.VITE_SOCKET_URL;
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }
  return `http://${window.location.hostname || "localhost"}:5001`;
};

// ── Module-level singleton ──────────────────────────────────────────────────
// One socket per browser tab for the lifetime of the page.
// Lives outside React so it survives StrictMode double-invoke and Vite HMR.
let _socketSingleton = null;

const getSocket = () => {
  if (!_socketSingleton) {
    _socketSingleton = io(getSocketURL(), {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return _socketSingleton;
};

// ── Provider ───────────────────────────────────────────────────────────────
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  // useRef so the guard persists across StrictMode's fake unmount/remount cycle
  const initialized = useRef(false);

  useEffect(() => {
    // Only initialize once per React component instance.
    // StrictMode creates a new instance on remount, so initialized.current
    // will be false again — but getSocket() returns the existing singleton.
    if (initialized.current) return;
    initialized.current = true;

    setSocket(getSocket());

    // Do NOT disconnect here. The singleton must survive HMR and StrictMode.
    // The browser closing the tab / navigating away ends the WebSocket naturally.
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);