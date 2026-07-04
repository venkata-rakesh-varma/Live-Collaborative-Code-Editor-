const Recording = require("../models/Recording");

const recordEvent = async (roomId, event) => {
  try {
    let recording = await Recording.findOne({ roomId });

    if (!recording) {
      recording = await Recording.create({
        roomId,
        events: [],
      });
    }

    recording.events.push({
      type: event.type,
      user: event.user || "Unknown",
      payload: event.payload || {},
      timestamp: new Date(),
    });

    await recording.save();
  } catch (error) {
    console.error("Recording Error:", error.message);
  }
};

module.exports = {
  recordEvent,
};