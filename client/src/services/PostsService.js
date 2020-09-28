import api_Kodik from '@/services/apiKodik'
import api_Shiki from '@/services/apiShiki'

export default {
  fetchPosts () {
    return api_Kodik().get('posts')
  },
  fetchMainPage () {
    return api_Kodik().get('api-list/')
  },
  fetchSearchName (name) {
    return api_Kodik().get('api-search/'+name)
  },
  fetcGetByIdShiki(id) {
    return api_Kodik().get('api-search-id/'+id)
  },
  fetcGetBySerialId(id) {
    return api_Kodik().get('api-serial-id/'+id)
  },
  fetcPlayList(serial_id,season,episode) {
    return api_Kodik().get(`api-get-url/${serial_id}/${season}/${episode}`)
  },

  shikiAnime(shiki_id) {
    return api_Shiki().get(`animes/${shiki_id}`)
  },
  shikiAnimeTop() {
    return api_Kodik().get(`api-list-top/`)
  },
}
