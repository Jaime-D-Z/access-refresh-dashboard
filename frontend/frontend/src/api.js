import axios from "axios";

const API_BASE = "http://localhost:8000/authapp";

export const getTokens = async () => {
  const res = await axios.get(`${API_BASE}/tokens/`);
  return res.data;
};

export const generateNewToken = async () => {
  const res = await axios.post(`${API_BASE}/tokens/new/`);
  return res.data;
};
