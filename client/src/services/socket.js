import { io } from "socket.io-client";

const getSocketURL = () => {
  const envUrl = import.meta.env.VITE_SOCKET_URL;
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }
  const hostname = window.location.hostname || "localhost";
  return `http://${hostname}:5001`;
};

const socket = io(
  getSocketURL(),
  {
    transports: ["websocket"],
    autoConnect: false,
  }
);

export default socket;