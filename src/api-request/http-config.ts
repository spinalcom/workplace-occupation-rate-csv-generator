import axios from "axios";
import { Agent } from "https";

const endpoint = "/api/v1";
const host = (process.env.API_URL || "").replace(`/\/$/`, (el) => "");
const baseURL = host.match(new RegExp(endpoint)) ? host : host + endpoint;

const http = axios.create({ baseURL });
http.interceptors.request.use((request) => {
  request.httpsAgent = new Agent({ rejectUnauthorized: false });
  return request;
});
export const HTTP = http;
