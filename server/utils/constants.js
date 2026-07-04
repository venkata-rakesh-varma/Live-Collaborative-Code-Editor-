const SOCKET_EVENTS = {
  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",
  CODE_CHANGE: "code-change",
  CURSOR_CHANGE: "cursor-change",
  CHAT_MESSAGE: "chat-message",
  LANGUAGE_CHANGE: "language-change",
  RUN_CODE: "run-code",
  SYNC_CODE: "sync-code",
  USER_TYPING: "user-typing",
};

const SUPPORTED_LANGUAGES = [
  "javascript",
  "python",
  "java",
  "cpp",
  "c",
];

module.exports = {
  SOCKET_EVENTS,
  SUPPORTED_LANGUAGES,
};