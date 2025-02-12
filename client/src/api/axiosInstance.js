import axios from "axios";

const axiosInstance = axios.create({
  baseURL:"https://skull-lms-server-js.vercel.app", //"http://localhost:5000"
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = JSON.parse(localStorage.getItem("accessToken")) || "";

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;