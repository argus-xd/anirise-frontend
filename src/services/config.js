import axios from "axios";
export default () => {
  return axios.create({
    baseURL: process.env.VUE_APP_BACKEND_HOST || "http://127.0.0.1:8090",
  });
};
