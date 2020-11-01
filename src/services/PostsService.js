/* eslint-disable */
import service from '@/services/config'

export default {
  fetchPosts () {
    return service().get('posts')
  },
  fetchMainPage () {
    return service().get('api-list/')
  },
  fetchSearchName (name) {
    return service().get('api-search/'+name)
  },
  fetcGetByIdShiki(id) {
    return service().get('api-search-id/'+id)
  },
  fetcGetBySerialId(id) {
    return service().get('api-serial-id/'+id)
  },
  fetcPlayList(serial_id,season,episode) {
    return service().get(`api-get-url/${serial_id}/${season}/${episode}`)
  },
  shikiFranchise(shiki_id) {
    return service().get(`api-franchise/${shiki_id}`)
  },
  shikiAnimeTop() {
    return service().get(`api-list-top/`)
  },
  searchInDB(name) {
    return service().get(`api-search-link/${name}`)
  },

  shikiAnime(shiki_id) {
    return service().get(`/api-shiki-id/${shiki_id}`)
  },


}
