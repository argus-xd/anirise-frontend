import axios from "axios";

const client = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_HOST || "http://127.0.0.1:8090",
});

const simpleGetRequest = (url, params = {}) => {
  return client
    .get(url, {
      params,
    })
    .then(({ data }) => data);
};

export default {
  animeList(limit = 100, sortField = "date", sortDirection = "desc") {
    return simpleGetRequest("/anime", {
      ["sort-field"]: sortField,
      ["sort-direction"]: sortDirection,
      limit,
    });
  },
  searchAnime(searchTerm) {
    return simpleGetRequest("/anime/search", { title: searchTerm });
  },
  fetchPosts() {
    return simpleGetRequest("/posts");
  },
  fetchMainPage() {
    return simpleGetRequest("/api-list");
  },
  fetchSearchName(name) {
    return simpleGetRequest("/api-search/" + name);
  },
  dubbingListByShikiId(id) {
    return simpleGetRequest("/api-search-id/" + id);
  },
  fetchGetBySerialId(id) {
    return simpleGetRequest("/api-serial-id/" + id);
  },
  fetchPlayList(serial_id, season, episode) {
    return simpleGetRequest(`/api-get-url/${serial_id}/${season}/${episode}`);
  },
  shikiFranchise(shiki_id) {
    return simpleGetRequest(`/api-franchise/${shiki_id}`);
  },
  shikiAnimeTop() {
    return simpleGetRequest(`/api-list-top/`);
  },
  searchInDB(name) {
    return simpleGetRequest(`/api-search-link/${name}`);
  },
  shikiInfoById(shiki_id) {
    return simpleGetRequest(`/api-shiki-id/${shiki_id}`);
  },
};
