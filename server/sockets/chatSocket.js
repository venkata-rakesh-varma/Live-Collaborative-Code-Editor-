const { recordEvent } = require("../recording/recordService");

module.exports = (io, socket) => {
  socket.on("chat-message", ({ roomId, message, username }) => {
    io.to(roomId).emit("chat-message", {
      username,
      message,
      timestamp: new Date(),
    });

    recordEvent(roomId, {
      type: "chat-message",
      user: username,
      payload: { message },
    });
  });

  socket.on("typing", ({ roomId, username }) => {
    socket.to(roomId).emit("typing", {
      username,
    });
  });

  socket.on("stop-typing", ({ roomId, username }) => {
    socket.to(roomId).emit("stop-typing", {
      username,
    });
  });
};