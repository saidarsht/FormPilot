import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;
console.log("API Base URL:", API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  console.log("Making API Request:", config.method, config.url);
  console.log("Request Headers:", config.headers);
  console.log("Request Data:", config.data);
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(
      error?.response?.data?.error || "Something Went Wrong. Try Again Later."
    );
  }
);

export default api;
