/* eslint-disable */
import service from '@/services/config'

export default {
  fetchPosts() {
    return service().get('posts')
  },
  async fetchMainPage() {
    const response = await service().get('api-list/')
    return response.data
  },
  async fetchSearchName(name) {
    const response = await service().get('api-search/' + name)
    return response.data
  },
  async fetcGetByIdShiki(id) {
    const response = await service().get('api-search-id/' + id)
    return response.data
  },
  async fetcGetBySerialId(id) {
    const response = await service().get('api-serial-id/' + id)
    return response.data
  },
  async fetcPlayList(serial_id, season, episode) {
    const response = await service().get(
      `api-get-url/${serial_id}/${season}/${episode}`
    )
    return response.data
  },
  async shikiFranchise(shiki_id) {
    const response = await service().get(`api-franchise/${shiki_id}`)
    return response.data
  },
  async shikiAnimeTop() {
    const response = await service().get(`api-list-top/`)
    return response.data
  },
  async searchInDB(name) {
    const response = await service().get(`api-search-link/${name}`)
    return response.data
  },

  async shikiInfoById(shiki_id) {
    const response = await service().get(`/api-shiki-id/${shiki_id}`)
    return response.data
  }
}
