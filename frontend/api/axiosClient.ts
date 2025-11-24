import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL || 'https://nudge-it.onrender.com';

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;