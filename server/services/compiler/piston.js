const axios = require("axios");

const executeCode = async (language, source, stdin = "") => {
  try {
    const response = await axios.post(
      `${process.env.PISTON_URL}/execute`,
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

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

module.exports = {
  executeCode,
};