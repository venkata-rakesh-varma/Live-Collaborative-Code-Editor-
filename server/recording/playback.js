const Recording = require("../models/Recording");

const getRecording = async (req, res) => {
  try {
    const { roomId } = req.params;

    const recording = await Recording.findOne({ roomId });

    if (!recording) {
      return res.status(404).json({
        success: false,
        message: "Recording not found",
      });
    }

    res.status(200).json({
      success: true,
      roomId,
      totalEvents: recording.events.length,
      events: recording.events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getRecording,
};