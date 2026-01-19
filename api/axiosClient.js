import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  console.log("Axios Request:", config.method, config.url, config.data);
  return config;
});

export default axiosClient;
