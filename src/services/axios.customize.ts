import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import nProgress from "nprogress";

nProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
  minimum: 0.28, // optional, giúp thanh hiện rõ hơn
});

const instance = axios.create({
  baseURL: `http://localhost:8080`, // import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // gửi cookie tự động
});
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // InternalAxiosRequestConfig đảm bảo một số trường không thể undefined (ví dụ headers), còn AxiosRequestConfig cho phép headers là undefined.
    nProgress.start();
    // debug
    console.log(
      "[axios] request:",
      config?.method,
      config?.url,
      "baseURL:",
      import.meta.env.VITE_BACKEND_URL
    );

    // đảm bảo headers tồn tại trước khi gán
    config.headers = config.headers || {};

    if (
      typeof window !== "undefined" &&
      window.localStorage &&
      window.localStorage.getItem("access_token")
    ) {
      config.headers.Authorization =
        "Bearer " + window.localStorage.getItem("access_token");
    }

    return config;
  },
  (error) => {
    nProgress.done(); // đảm bảo đóng khi request error
    console.error("[axios] request error:", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    nProgress.done();
    // debug
    console.log("[axios] response:", response.status, response.config.url);

    // trả về data trực tiếp để caller dễ dùng
    return response;
    // or: return response.data;
  },
  (error) => {
    nProgress.done(); // đóng cả khi response lỗi
    console.error("[axios] response error:", error?.response || error);
    return Promise.reject(error);
  }
);

export default instance;
// ...existing code...
