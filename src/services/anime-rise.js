import axios from "axios";

const baseURL = process.env.VUE_APP_BACKEND_HOST || "http://127.0.0.1:3000";

const client = axios.create({
  baseURL,
});

const simpleGetRequest = (url, params = {}) => {
  return client
    .get(url, {
      params,
    })
    .then(({ data }) => data);
};

export default {
  episodeSource: (episode, translation) =>
    baseURL + `/playlist/${translation}/${episode}`,
  animeList: (limit = 100, sortField = "date", sortDirection = "desc") => {
    return simpleGetRequest("/anime", {
      ["sort-field"]: sortField,
      ["sort-direction"]: sortDirection,
      limit,
    });
  },
  searchAnime: searchTerm => {
    return simpleGetRequest("/anime/search", { title: searchTerm });
  },
  animeById: id => {
    return simpleGetRequest("/anime/" + id);
  },
  animeTranslations: (id, translation) => {
    return simpleGetRequest(`/anime/${id}/translations`, { translation });
  },
};
