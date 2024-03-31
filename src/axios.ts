import axios from "axios";
import { TR_API_KEY, TR_API_TOKEN } from "./models";

// Axios custom instance
const fetch = axios.create({
  baseURL: "https://api.trello.com/1",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor always attach key, and token to the request
fetch.interceptors.request.use(
  (config) => {
    // Add your global parameters to the request config
    config.params = {
      ...config.params,
      key: TR_API_KEY,
      token: TR_API_TOKEN,
      // Add more parameters as needed
    };

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default fetch;