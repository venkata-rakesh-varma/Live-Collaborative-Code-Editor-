// server/server.js

require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const initializeSocket = require("./sockets");
const errorHandler = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const { getRecording } = require("./recording/playback");

const app = express();
const server = http.createServer(app);


connectDB();


app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 CodeSync Server Running",
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/compiler", compilerRoutes);

// Recording Playback Route
app.get("/api/recordings/:roomId", getRecording);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

initializeSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
=========================================
🚀 CodeSync Backend Started Successfully
=========================================
Server : http://localhost:${PORT}
MongoDB: Connected
Socket : Enabled
Environment : ${process.env.NODE_ENV || "development"}
=========================================
`);
});