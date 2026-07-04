const axios = require("axios");

const submitCode = async (payload) => {
  try {
    const response = await axios.post(
      process.env.JUDGE0_API,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

module.exports = {
  submitCode,
};