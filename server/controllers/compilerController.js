const axios = require("axios");

exports.executeCode = async (req, res) => {
  try {
    const { language, source, stdin } = req.body;

    const response = await axios.post(
      process.env.PISTON_URL + "/execute",
      {
        language,
        version: "*",
        files: [
          {
            content: source,
          },
        ],
        stdin,
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};