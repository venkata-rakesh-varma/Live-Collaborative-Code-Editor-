import api from "./api";

export const executeCode = async ({
  language,
  source,
  stdin = "",
}) => {
  try {
    const response = await api.post("/compiler/execute", {
      language,
      source,
      stdin,
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Code execution failed",
      }
    );
  }
};