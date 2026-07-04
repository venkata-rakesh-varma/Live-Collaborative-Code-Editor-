const fs = require("fs");
const path = require("path");

const files = {
  // Root
  "README.md": "# CodeSync\n",
  ".gitignore": "node_modules/\n.env\n",
  ".env.example": `PORT=5000
MONGO_URI=
JWT_SECRET=
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
JUDGE0_API=
PISTON_URL=
`,
  "docker-compose.yml": "# TODO",

  // Client
  "client/package.json": "{}",
  "client/vite.config.js": "// TODO",
  "client/public/.gitkeep": "",

  "client/src/main.jsx": `// TODO: React Entry Point`,
  "client/src/App.jsx": `// TODO: App Component`,

  // Assets
  "client/src/assets/.gitkeep": "",

  // Components
  "client/src/components/editor/CodeEditor.jsx": `// TODO Member 1`,
  "client/src/components/editor/CursorLayer.jsx": `// TODO Member 2`,
  "client/src/components/editor/EditorToolbar.jsx": `// TODO Member 1`,
  "client/src/components/editor/TODO.md": "# Editor Module",

  "client/src/components/chat/ChatBox.jsx": `// TODO Member 4`,
  "client/src/components/chat/Message.jsx": `// TODO Member 4`,
  "client/src/components/chat/TODO.md": "# Chat Module",

  "client/src/components/output/OutputConsole.jsx": `// TODO Member 4`,
  "client/src/components/output/TODO.md": "# Output Module",

  "client/src/components/layout/Navbar.jsx": `// TODO`,
  "client/src/components/layout/Sidebar.jsx": `// TODO`,
  "client/src/components/layout/Footer.jsx": `// TODO`,

  "client/src/components/common/Button.jsx": `// TODO`,
  "client/src/components/common/Loader.jsx": `// TODO`,

  // Pages
  "client/src/pages/Home.jsx": `// TODO`,
  "client/src/pages/CreateRoom.jsx": `// TODO`,
  "client/src/pages/JoinRoom.jsx": `// TODO`,
  "client/src/pages/EditorPage.jsx": `// TODO`,

  // Context
  "client/src/context/AuthContext.jsx": `// TODO`,
  "client/src/context/SocketContext.jsx": `// TODO`,

  // Hooks
  "client/src/hooks/useSocket.js": `// TODO Member 2`,
  "client/src/hooks/useEditor.js": `// TODO`,
  "client/src/hooks/TODO.md": "# Hooks",

  // Services
  "client/src/services/api.js": `// TODO`,
  "client/src/services/socket.js": `// TODO`,
  "client/src/services/compiler.js": `// TODO`,

  // Utils
  "client/src/utils/constants.js": `// TODO`,
  "client/src/utils/helpers.js": `// TODO`,

  // Styles
  "client/src/styles/global.css": `/* TODO */`,
  "client/src/styles/theme.css": `/* TODO */`,

  // Server
  "server/package.json": "{}",
  "server/server.js": `// TODO Express Server`,

  // Config
  "server/config/db.js": `// TODO MongoDB`,
  "server/config/env.js": `// TODO Env`,

  // Controllers
  "server/controllers/authController.js": `// TODO Member 3`,
  "server/controllers/roomController.js": `// TODO Member 3`,
  "server/controllers/compilerController.js": `// TODO Member 4`,

  // Models
  "server/models/User.js": `// TODO`,
  "server/models/Room.js": `// TODO`,
  "server/models/Message.js": `// TODO`,
  "server/models/Recording.js": `// TODO`,

  // Routes
  "server/routes/authRoutes.js": `// TODO`,
  "server/routes/roomRoutes.js": `// TODO`,
  "server/routes/compilerRoutes.js": `// TODO`,

  // Middleware
  "server/middleware/authMiddleware.js": `// TODO`,
  "server/middleware/errorMiddleware.js": `// TODO`,

  // Sockets
  "server/sockets/index.js": `// TODO Member 2`,
  "server/sockets/editorSocket.js": `// TODO`,
  "server/sockets/chatSocket.js": `// TODO`,

  // Services
  "server/services/compiler/judge0.js": `// TODO`,
  "server/services/compiler/piston.js": `// TODO`,

  // Recording
  "server/recording/recordService.js": `// TODO Member 5`,
  "server/recording/playback.js": `// TODO Member 5`,

  // Utils
  "server/utils/logger.js": `// TODO`,
  "server/utils/constants.js": `// TODO`,

  // Shared
  "shared/socketEvents.js": `// TODO Shared Events`,
  "shared/constants.js": `// TODO Shared Constants`,

  // Docs
  "docs/API.md": "# API",
  "docs/ARCHITECTURE.md": "# Architecture",
  "docs/TEAM_GUIDE.md": "# Team Guide",

  // Tests
  "tests/.gitkeep": "",
};

Object.entries(files).forEach(([filePath, content]) => {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, content);
});

console.log("✅ CodeSync project structure created successfully!");