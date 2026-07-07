import { useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";

const useSocketEvents = (events = {}) => {
  const { socket } = useSocket();
  const eventsRef = useRef(events);

  // Always keep the ref updated with the latest handlers
  useEffect(() => {
    eventsRef.current = events;
  });

  useEffect(() => {
    if (!socket) return;

    // Create wrapper handlers that always fetch and run the latest handler from ref
    const registeredHandlers = {};

    Object.keys(eventsRef.current).forEach((event) => {
      const handler = (...args) => {
        if (eventsRef.current[event]) {
          eventsRef.current[event](...args);
        }
      };
      registeredHandlers[event] = handler;
      socket.on(event, handler);
    });

    return () => {
      Object.entries(registeredHandlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket]); // Re-register only if socket changes

  return socket;
};

export default useSocketEvents;