const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid");

// Create Room
exports.createRoom = async (req, res) => {
  try {
    const { title, language } = req.body;

    const room = await Room.create({
      roomId: uuidv4(),
      title,
      language,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      room,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Join Room
exports.joinRoom = async (req, res) => {
  try {
    const { roomId, username } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    room.participants.push({
      userId: req.user.id,
      username,
    });

    await room.save();

    res.json({
      success: true,
      room,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Room
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      roomId: req.params.roomId,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Code
exports.updateCode = async (req, res) => {
  try {
    const { code } = req.body;

    const room = await Room.findOneAndUpdate(
      { roomId: req.params.roomId },
      { code },
      { new: true }
    );

    res.json(room);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};