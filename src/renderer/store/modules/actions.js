export default {
  async logout ({ commit, state }) {
    await window.API.Platform.BiliBili.API.logout()
    commit('deleteUserInfo')
  },
  async getModuleList ({ commit, state }) {
    commit('setModuleList', await window.API.Module.getAllModuleList())
  }
}
