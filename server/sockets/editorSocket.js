const { recordEvent } = require("../recording/recordService");

module.exports = (io, socket) => {
  const broadcastRoomUsers = (roomId) => {
    const activeUsers = [];
    const clients = io.sockets.adapter.rooms.get(roomId);
    if (clients) {
      for (const clientId of clients) {
        const clientSocket = io.sockets.sockets.get(clientId);
        if (clientSocket && clientSocket.username) {
          if (!activeUsers.some((u) => u.username === clientSocket.username)) {
            activeUsers.push({
              socketId: clientId,
              username: clientSocket.username,
            });
          }
        }
      }
    }
    io.to(roomId).emit("room-users-update", activeUsers);
  };

  socket.on("join-room", ({ roomId, username }) => {
    socket.username = username;
    socket.roomId = roomId;
    socket.join(roomId);

    // Notify other users in the room
    socket.to(roomId).emit("user-joined", { username });

    broadcastRoomUsers(roomId);

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
    socket.to(roomId).emit("cursor-update", {
      socketId: socket.id,
      username: socket.username,
      cursor,
    });
  });

  socket.on("language-change", ({ roomId, language }) => {
    socket.to(roomId).emit("language-update", language);
    recordEvent(roomId, {
      type: "language-change",
      payload: { language },
    });
  });

  socket.on("leave-room", ({ roomId, username }) => {
    // Notify other users in the room
    socket.to(roomId).emit("user-left", { socketId: socket.id, username });
    socket.leave(roomId);
    broadcastRoomUsers(roomId);
  });

  socket.on("disconnect", () => {
    if (socket.roomId) {
      if (socket.username) {
        socket.to(socket.roomId).emit("user-left", { socketId: socket.id, username: socket.username });
      }
      broadcastRoomUsers(socket.roomId);
    }
  });
};