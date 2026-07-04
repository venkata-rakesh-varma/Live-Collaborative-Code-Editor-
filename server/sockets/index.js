const { Server } = require("socket.io");
const registerEditorSocket = require("./editorSocket");
const registerChatSocket = require("./chatSocket");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ User Connected: ${socket.id}`);

    registerEditorSocket(io, socket);
    registerChatSocket(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ User Disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initializeSocket;