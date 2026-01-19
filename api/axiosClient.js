import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/* 🔹 Request logging (from new crisp version) */
axiosClient.interceptors.request.use((config) => {
  console.log(
    "Axios Request:",
    config.method?.toUpperCase(),
    config.url,
    config.data
  );
  return config;
});

/* 🔹 Global response + error handling (old version) */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default axiosClient;
