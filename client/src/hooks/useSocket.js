import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

const useSocketEvents = (events = {}) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    Object.entries(events).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(events).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, events]);

  return socket;
};

export default useSocketEvents;