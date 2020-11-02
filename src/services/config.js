import axios from "axios";
export default () => {
  return axios.create({
    baseURL: "http://animerise.ddns.net:3000",
  });
};
