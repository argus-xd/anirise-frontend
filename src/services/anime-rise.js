import axios from "axios";

const client = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_HOST || "http://127.0.0.1:8090",
});

const simpleRequest = (endpoint, method = "get") => {
  return client[method](endpoint)
    .then(({ data }) => data)
    .catch(() => {
      console.error(`Backend respond with error on endpoint ${endpoint}`);
    });
};

export default {
  fetchPosts() {
    return simpleRequest("/posts");
  },
  fetchMainPage() {
    return simpleRequest("/api-list");
  },
  fetchSearchName(name) {
    return simpleRequest("/api-search/" + name);
  },
  dubbingListByShikiId(id) {
    return simpleRequest("/api-search-id/" + id);
  },
  fetchGetBySerialId(id) {
    return simpleRequest("/api-serial-id/" + id);
  },
  fetchPlayList(serial_id, season, episode) {
    return simpleRequest(`/api-get-url/${serial_id}/${season}/${episode}`);
  },
  shikiFranchise(shiki_id) {
    return simpleRequest(`/api-franchise/${shiki_id}`);
  },
  shikiAnimeTop() {
    return simpleRequest(`/api-list-top/`);
  },
  searchInDB(name) {
    return simpleRequest(`/api-search-link/${name}`);
  },
  shikiInfoById(shiki_id) {
    return simpleRequest(`/api-shiki-id/${shiki_id}`);
  },
};
