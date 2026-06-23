import axios from "axios";

const api = axios.create({
  baseURL: "https://loan-finance-platform.onrender.com/api",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

export default api;