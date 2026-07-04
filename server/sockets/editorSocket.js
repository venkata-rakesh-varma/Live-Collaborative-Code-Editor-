const { recordEvent } = require("../recording/recordService");

module.exports = (io, socket) => {
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    socket.to(roomId).emit("user-joined", {
      socketId: socket.id,
      username,
    });

    recordEvent(roomId, {
      type: "join-room",
      user: username,
    });
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-update", code);

    recordEvent(roomId, {
      type: "code-change",
      payload: { code },
    });
  });

  socket.on("cursor-change", ({ roomId, cursor }) => {
    socket.to(roomId).emit("cursor-update", cursor);
  });

  socket.on("language-change", ({ roomId, language }) => {
    socket.to(roomId).emit("language-update", language);
  });

  socket.on("leave-room", ({ roomId, username }) => {
    socket.leave(roomId);

    socket.to(roomId).emit("user-left", {
      socketId: socket.id,
      username,
    });
  });
};