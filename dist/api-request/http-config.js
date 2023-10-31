"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP = void 0;
const axios_1 = require("axios");
const https_1 = require("https");
const endpoint = "/api/v1";
const host = (process.env.API_URL || "").replace(`/\/$/`, (el) => "");
const baseURL = host.match(new RegExp(endpoint)) ? host : host + endpoint;
const http = axios_1.default.create({ baseURL });
http.interceptors.request.use((request) => {
    request.httpsAgent = new https_1.Agent({ rejectUnauthorized: false });
    return request;
});
exports.HTTP = http;
//# sourceMappingURL=http-config.js.map