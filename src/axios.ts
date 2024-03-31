import axios from "axios";
import * as core from "@actions/core"
import * as github from "@actions/github"

const trKey = "94435abbd4bd7fd4cc071160fcb7b87e" // core.getInput(`tr-key`, { required: true }); // trello api key
const trToken = "ATTAfa551c260fc09fff3338d48ee801904ba91ba723b70baa400b27d5d9db481c625610FED6"// core.getInput(`tr-token`, { required: true }); // trello auth token

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
      key: trKey,
      token: trToken,
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