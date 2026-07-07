const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createRoom,
  joinRoom,
  getRoom,
  updateCode,
} = require("../controllers/roomController");

router.post("/", createRoom);
router.post("/join", protect, joinRoom);
router.get("/:roomId", protect, getRoom);
router.put("/:roomId/code", protect, updateCode);

module.exports = router;