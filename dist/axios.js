"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const trKey = "94435abbd4bd7fd4cc071160fcb7b87e"; // core.getInput(`tr-key`, { required: true }); // trello api key
const trToken = "ATTAfa551c260fc09fff3338d48ee801904ba91ba723b70baa400b27d5d9db481c625610FED6"; // core.getInput(`tr-token`, { required: true }); // trello auth token
// Axios custom instance
const fetch = axios_1.default.create({
    baseURL: "https://api.trello.com/1",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});
// Interceptor always attach key, and token to the request
fetch.interceptors.request.use((config) => {
    // Add your global parameters to the request config
    config.params = Object.assign(Object.assign({}, config.params), { key: trKey, token: trToken });
    return config;
}, (error) => {
    // Handle request error
    return Promise.reject(error);
});
exports.default = fetch;
